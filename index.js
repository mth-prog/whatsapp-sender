const puppeteer = require('puppeteer');
const fs = require("fs");

async function bot(json, mensagem) {

    var content = fs.readFileSync(json);
    const ObjTxtJson = JSON.parse(content)

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    this.page = page;
    
    //instacia do qr primeiro 

    await page.goto("https://web.whatsapp.com/", {
      waitUntil: 'load',
      timeout: 360000})
    try {
        await page.waitForXPath("//div[contains(text(), 'Para usar o WhatsApp')]", {timeout: 360000, waitUntil: 'load'})
        await page.waitForNavigation({waitUntil: 'load'});
    }
     catch (error) {
        console.log("erro de login")
        browser.close();
     }  
    
    for(var i = 0; i < Object.keys(ObjTxtJson).length; i++) {
      
      await page.goto(`https://web.whatsapp.com/send?phone=${ObjTxtJson[i].telefone}`, {timeout: 360000, waitUntil: 'load'});

      await page.waitForXPath('//div/span[contains(@data-testid, "clip")]', {timeout: 360000, waitUntil: 'load'})

      const textoWhatsapp = page.$x("//div[contains(text(), 'Send and receive')] | //div[contains(text(), 'Envie e receba')]") 

        while(textoWhatsapp.length > 0) {
          await page.goto(`https://web.whatsapp.com/send?phone=${ObjTxtJson[i].telefone}`, {timeout: 360000, waitUntil: 'load'})
        }
      
        await page.waitForXPath('//div/p[contains(@class, "selectable-text copyable-text")]')

        const barra_mensagem = await page.$x('//div/p[contains(@class, "selectable-text copyable-text")]')
        if (barra_mensagem.length > 0) {
          await barra_mensagem[0].click()
        }

        await page.evaluate((mensagem) => {
          document.execCommand("insertText", false, mensagem);
        },mensagem)   

        await page.click("span[data-testid='send']", {delay:4000});

        await delay(5000);

        await page.click("span[data-testid='clip']", {delay:4000});

        await delay(5000)
          
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),                     
            page.click("#main > footer > div._2BU3P.tm2tP.copyable-area > div > span:nth-child(2) > div > div._3HQNh._1un-p > div._2jitM > div > span > div > div > ul > li:nth-child(4) > button > span"), //~ 'button[aria-label="Document"]', ('//ul/li[4]')
  
          ]);
          /* accept apenas aceita itens dentro de array */

          var arrayAnexo = []

          arrayAnexo.push(ObjTxtJson[i].anexo)
          
          await fileChooser.accept(arrayAnexo); //["C:/Users/VBA/Desktop/book.png", "C:/Users/VBA/Desktop/branch.png"]
          await delay(5000)
  
            const btn_envia = await page.$x('//div/span[contains(@data-testid, "send")]')
            if (btn_envia.length > 0) {
              await btn_envia[0].click()
            }

            //limpa o array 
            arrayAnexo.splice(0, arrayAnexo.length)

          await delay(5000);  
          
      };

  await browser.close();

};

function delay(time){
    return new Promise(function(resolve){
        setTimeout(resolve,time)
    })

}

module.exports = bot
