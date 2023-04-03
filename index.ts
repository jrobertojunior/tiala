import fs from "fs";

const airtableFile = fs.readFileSync("data/tiala-airtable.csv", "utf8");
const airtableFileLines = airtableFile.split("\n");

console.log(airtableFileLines[0]);

// convert csv to json codigo;nome do produto;sexo;tamanho;cor;imagem;quantidade;valor de custo;perc lucro;valor de venda

const airtableJson = airtableFileLines.map((line) => {
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
  return {
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
  };
});

console.log(airtableJson);
