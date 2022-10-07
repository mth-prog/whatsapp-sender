const caminho = process.argv;
const bot = require('./index')

async function processaTexto(caminhoDeArquivo) {
    const json = caminhoDeArquivo[2]
    const mensagem = caminhoDeArquivo[3]
    bot(json, mensagem)
}

processaTexto(caminho);


