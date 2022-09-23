const caminho = process.argv;
const bot = require('./index')

async function processaTexto(caminhoDeArquivo) {
    const mensagem = caminhoDeArquivo[2]
    const Telefone = caminhoDeArquivo[3];
    const anexo = caminhoDeArquivo[4]
    bot(mensagem, Telefone, anexo)
}

processaTexto(caminho);


