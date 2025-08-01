This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



@frontend/ 

corrija:


1. TON WALLET CONNECTED: meu endereço não é 0:48ae...57fc e sim UQBIrvVE2rDT8eRTHYo9hGeZLxDqVHwKHeouYO3L6_5X_MBB
2. No input precisa aparecer um calendario grande para facilitar o UX
3. Tem 2 Toast aparecendo, deixe nenhum
4. Remove o botao copy proof data
5. Troque o campo "Nullifier: 0xd281cde0...abcd" por "STATUS: 18+ CONFIRMED"
6. Adicione o botão de logout no top junto onde mostra a carteira


Quero que vc avalie as imagens que mandei, e desenhe rigorosamente fiel no código.

as funcionalidades a serem implementadas sao:

o usuário pode salvar varias provas (ficam no localstorage

ao clicar no ticket da prova ela abre para o seguinte link: https://zkverify-testnet.subscan.io/extrinsic/PROOF_CODE

ele pode rolar pelas provas que ele cria

pra cada ticket da prova, deve mostrar o bar code na vertical gerado apartir do PROOF_CODE

Não vou mais usar Qrcode e sim BarCode

Espere do backend um proofCode e não mais o txHash

O Verify Proof deve abrir a camera para ler um código de barras

1. MUDANÇAS NA ESTRUTURA DE DADOS

1.1 Atualizar interface de dados para usar proofCode em vez de txHash

1.2 Modificar localStorage para armazenar array de provas por wallet (múltiplas provas)

1.3 Criar estrutura de dados para cada prova: { proofCode, birthYear, verifiedDate, id }

2. BACKEND INTEGRATION

2.1 Atualizar generateProof.ts para esperar proofCode do backend

2.2 Modificar tratamento de resposta do backend na GenerateProofForm.tsx

2.3 Atualizar URL de verificação para usar proofCode: https://zkverify-testnet.subscan.io/extrinsic/{proofCode}

3. COMPONENTE DE CÓDIGO DE BARRAS

3.1 Criar novo componente BarCode.tsx para substituir OfflineQRCode.tsx

3.2 Implementar geração de código de barras vertical usando o proofCode

3.3 Configurar biblioteca de código de barras (JsBarcode ou similar)

4. GERENCIAMENTO DE MÚLTIPLAS PROVAS

4.1 Modificar SuccessSection.tsx para mostrar lista de provas em vez de prova única

4.2 Implementar sistema de scroll/carrossel para navegar entre provas

4.3 Atualizar lógica de salvamento no localStorage para array de provas

4.4 Implementar lógica de carregamento de provas salvas na inicialização

5. FUNCIONALIDADE DE SCANNER DE CÓDIGO DE BARRAS

5.1 Modificar função scanProof no ProofTicket.tsx para ler códigos de barras

5.2 Integrar biblioteca de leitura de código de barras (QuaggaJS ou ZXing)

5.3 Atualizar interface da câmera para detecção de código de barras

5.4 Modificar lógica de verificação para funcionar com códigos de barras

6. ATUALIZAÇÃO DE COMPONENTES

6.1 Atualizar ProofTicket.tsx para usar código de barras em vez de QR code

6.2 Modificar layout do ticket para acomodar código de barras vertical

6.3 Atualizar GenerateProofForm.tsx para salvar múltiplas provas

6.4 Modificar page.tsx para gerenciar estado de múltiplas provas

7. INTERFACE VISUAL

7.1 Implementar navegação entre provas (botões anterior/próximo ou swipe)

7.2 Adicionar indicadores visuais de quantas provas existem

7.3 Atualizar design dos tickets para mostrar código de barras vertical

7.4 Implementar animações de transição entre provas

8. LIMPEZA E REFATORAÇÃO

8.1 Remover OfflineQRCode.tsx e qrCodeLoader.ts (não mais necessários)

8.2 Atualizar imports e referências para usar novo componente de código de barras

8.3 Limpar código relacionado a QR codes nos componentes existentes

9. TESTES E VALIDAÇÃO

9.1 Testar salvamento e carregamento de múltiplas provas

9.2 Testar navegação entre provas

9.3 Testar geração e leitura de códigos de barras

9.4 Testar funcionalidade da câmera para scanner

10. DEPENDÊNCIAS

10.1 Adicionar biblioteca de geração de código de barras ao projeto

10.2 Adicionar biblioteca de leitura de código de barras para câmera

10.3 Atualizar package.json com novas dependências

Ordem de execução sugerida: 1 → 2 → 3 → 10 → 4 → 6 → 5 → 7 → 8 → 9