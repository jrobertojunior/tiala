import fs, { writeFileSync } from "fs";

const airtableFile = fs.readFileSync("data/tiala-airtable.csv", "utf8");
const airtableFileLines = airtableFile.split("\n").slice(1);

const airtableJson = airtableFileLines.map((line) => {
  // remove '\r' from line
  line = line.replace("\r", "");

  const [
    codigo,
    nome,
    sexo,
    tamanho,
    cor,
    imagem,
    quantidade,
    custo,
    lucro,
    venda,
  ] = line.split(";");

  function formatCurrencyBRL(value: string): string {
    // remove R$ and .
    value = value.replace("R$", "").replace(".", ",");
    return value;
  }

  return {
    codigo,
    nome,
    sexo,
    tamanho,
    cor,
    imagem,
    quantidade,
    custo: formatCurrencyBRL(custo),
    lucro,
    venda: formatCurrencyBRL(venda),
  };
});
writeFileSync(
  "./out/tiala-airtable.json",
  JSON.stringify(airtableJson, null, 2)
);

const airtableIndexedByNome = airtableJson.reduce((acc: any, item) => {
  if (acc[item.nome]) {
    acc[item.nome].push(item);
    return acc;
  }
  acc[item.nome] = [item];
  return acc;
}, {});

writeFileSync(
  "./out/tiala-airtable-names.json",
  JSON.stringify(airtableIndexedByNome, null, 2)
);

const bingHeader =
  "Código;Descrição;Unidade;NCM;Origem;Preço;Valor IPI fixo;Observações;Situação;Estoque;Preço de custo;Cód no fornecedor;Fornecedor;Localização;Estoque maximo;Estoque minimo;Peso líquido (Kg);Peso bruto (Kg);GTIN/EAN;GTIN/EAN da embalagem;Largura do Produto;Altura do Produto;Profundidade do produto;Data Validade;Descrição do Produto no Fornecedor;Descrição Complementar;Unidade por Caixa;Produto Variação;Tipo Produção;Classe de enquadramento do IPI;Código da lista de serviços;Tipo do item;Grupo de Tags/Tags;Tributos;Código Pai;Código Integração;Grupo de produtos;Marca;CEST;Volumes;Descrição Curta;Cross-Docking;URL Imagens Externas;Link Externo;Meses Garantia no Fornecedor;Clonar dados do pai;Condição do produto;Frete Grátis;Número FCI;Vídeo;Departamento;Unidade de medida;Preço de compra;Valor base ICMS ST para retenção;Valor ICMS ST para retenção;Valor ICMS próprio do substituto;Categoria do produto;Informações Adicionais";
const bingRows: string[] = [];

for (const nome in airtableIndexedByNome) {
  const items = airtableIndexedByNome[nome];

  const item = items[0];
  const parentCode = "PAI" + item.codigo;
  // cria uma linha para o pai
  const row = createBingRow(
    parentCode,
    item.nome,
    item.imagem,
    item.custo,
    item.quantidade,
    "",
    item.venda
  );
  bingRows.push(row);
  for (const item of items) {
    // cria uma linha para cada filho
    const row = createBingRow(
      item.codigo,
      `"Tamanho: ${item.tamanho};Sexo: ${item.sexo}"`,
      item.imagem,
      item.custo,
      item.quantidade,
      parentCode,
      item.venda
    );
    bingRows.push(row);
  }
}

writeFileSync("./out/tiala-bing.csv", bingHeader + "\n" + bingRows.join("\n"));

function createBingRow(
  codigo: string,
  descricao: string,
  imagem: string,
  valorDeCusto: string,
  quantidade: string,
  codigoPai: string,
  valorDeVenda: string
): string {
  let row = "";

  // Código
  row += codigo + ";";
  // Descrição
  row += descricao + ";";
  // Unidade
  row += "UN" + ";";
  // NCM
  row += "62092000" + ";";
  // Origem
  row += "0" + ";";
  // Preço
  row += valorDeVenda + ";";
  // Valor IPI fixo
  row += ";";
  // Observações
  row += ";";
  // Situação
  row += "Ativo" + ";";
  // Estoque
  row += quantidade + ";";
  // Preço de custo
  row += valorDeCusto + ";";
  // Cód no fornecedor
  row += ";";
  // Fornecedor
  row += ";";
  // Localização
  row += ";";
  // Estoque maximo
  row += ";";
  // Estoque minimo
  row += ";";
  // Peso líquido (Kg)
  row += ";";
  // Peso bruto (Kg)
  row += ";";
  // GTIN/EAN
  row += ";";
  // GTIN/EAN da embalagem
  row += ";";
  // Largura do Produto
  row += ";";
  // Altura do Produto
  row += ";";
  // Profundidade do produto
  row += ";";
  // Data Validade
  row += ";";
  // Descrição do Produto no Fornecedor
  row += descricao + ";";
  // Descrição Complementar
  row += descricao + ";";
  // Unidade por Caixa
  row += "1" + ";";
  // Produto Variação
  row += ";";
  // Tipo Produção
  row += ";";
  // Classe de enquadramento do IPI
  row += ";";
  // Código da lista de serviços
  row += ";";
  // Tipo do item
  row += "produto" + ";";
  // Grupo de Tags/Tags
  row += ";";
  // Tributos
  row += ";";
  // Código Pai
  row += codigoPai + ";";
  // Código Integração
  row += ";";
  // Grupo de produtos
  row += ";";
  // Marca
  row += ";";
  // CEST
  row += "28.059.00" + ";";
  // Volumes
  row += "1" + ";";
  // Descrição Curta
  row += descricao + ";";
  // Cross-Docking
  row += ";";
  // URL Imagens Externas
  row += imagem + ";";
  // Link Externo
  row += ";";
  // Meses Garantia no Fornecedor
  row += ";";
  // Clonar dados do pai
  row += (codigoPai !== "" ? "SIM" : "") + ";";
  // Condição do produto
  row += "Novo" + ";";
  // Frete Grátis
  row += "Não" + ";";
  // Número FCI
  row += ";";
  // Vídeo
  row += ";";
  // Departamento
  row += ";";
  // Unidade de medida
  row += "centímetro" + ";";
  // Preço de compra
  row += valorDeCusto + ";";
  // Valor base ICMS ST para retenção
  row += ";";
  // Valor ICMS ST para retenção
  row += ";";
  // Valor ICMS próprio do substituto
  row += ";";
  // Categoria do produto
  row += ";";
  // Informações Adicionais
  row += "";

  return row;
}
