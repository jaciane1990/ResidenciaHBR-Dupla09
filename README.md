## Sistema de Controle de Acesso e Voucher para Refeição Escolar ##

Este projeto faz parte da Residência Tecnológica e consiste em uma plataforma para gestão e controle de acesso às refeições escolares através de biometria e autenticação por papéis.

### 🚀 Sobre o Projeto ###

O sistema foi desenvolvido para automatizar o controle de entrega de refeições, garantindo que cada aluno utilize seu voucher diário de forma única, seja através de reconhecimento biométrico ou liberação manual com justificativa.

**Principais Funcionalidades**

* Autenticação Multi-nível: Login tradicional para operadores e empresas, e login via Google OAuth para fiscais e administradores.
* Gestão de Estudantes: Cadastro individual com foto e importação em lote via CSV.
* Controle Biométrico: Integração com leitor biométrico (simulado via código hexadecimal) para validação de acesso.
* Dashboards em Tempo Real: Visualização de métricas via WebSockets para empresas, fiscais e gestão.
* Relatórios e Validação: Geração de relatórios em PDF/CSV e processo de validação fiscal com protocolos únicos.

### 🛠 Tecnologias Utilizadas (Frontend) ###

**Conforme o planejamento técnico estabelecido:**
* React com Vite (Core do projeto)
* TypeScript (Tipagem estática)
* TailwindCSS (Estilização)
* React Router DOM (Navegação)
* Axios (Consumo de API)
* Context API (Gerenciamento de estado global)
* Bibliotecas Auxiliares: react-hot-toast, react-icons, react-chartjs-2, date-fns.

### 📋 Estrutura de Desenvolvimento (Sprints) ###

**O projeto seguiu um cronograma de 12 semanas:**
1. Sprints 1-2: Fundação, configuração do ambiente e sistema de autenticação.
2. Sprints 3-4: CRUD de estudantes e importação em lote.
3. Sprints 5-6: Integração biométrica e regras de negócio do voucher.
4. Sprints 7-8: Liberação manual e Dashboard da Empresa (Real-time).
5. Sprints 9-10: Dashboards para Fiscal/Gestão e módulo de exportação de relatórios.
6. Sprints 11-12: Validação fiscal, configurações do sistema e deploy final.

### 🔧 Como Executar o Projeto ###
**Pré-requisitos:**
- Node.js v18+ (recomendado)
- `npm` (vem com o Node.js)

**Instalação:**
1. Clone o repositório:

```bash
git clone https://github.com/jaciane1990/ResidenciaHBR-Dupla09
cd ResidenciaHBR-Dupla09-1
```
2. Instale as dependências:

```bash
npm install
```

3. (Opcional) Crie um arquivo `.env` na raiz com as variáveis necessárias, por exemplo:

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=seu_client_id
```

**Rodar em desenvolvimento:**

```bash
npm run dev
```

- O Vite exibirá a URL local no terminal (ex.: `http://localhost:5173` ou `http://localhost:5174` se a porta padrão estiver ocupada).
- Para abrir automaticamente no navegador no Windows:

```powershell
start http://localhost:5173
```

**Build e preview (produção):**

```bash
npm run build
npm run preview
```

`npm run preview` serve o build para testar o resultado de produção localmente.

**Lint:**

```bash
npm run lint
```

**Dicas de solução de problemas:**
- Forçar uma porta diferente:

```bash
npm run dev -- --port 5174
```
- Expor a aplicação na rede (acessar por outro dispositivo):

```bash
npm run dev -- --host
```
- Se houver problemas com dependências, remova `node_modules` e `package-lock.json` e reinstale:

```bash
rm -rf node_modules package-lock.json
npm install
```

--
Cole este bloco no README para instruções rápidas de execução.
