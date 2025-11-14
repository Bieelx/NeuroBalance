# NeuroBalance 🧠

![Status: Em Desenvolvimento](https://img.shields.io/badge/status-em_desenvolvimento-yellow.svg)

Um protótipo de app (MVP) em React Native para monitoramento de saúde mental e prevenção de burnout, desenvolvido como projeto de sprint.

## O Problema

O burnout é uma das principais causas de afastamento no trabalho. A identificação precoce de sinais de estresse é fundamental para prevenir o esgotamento.

O NeuroBalance propõe-se a ser uma ferramenta de check-in diário que utiliza IA (na sua versão final) para analisar a voz e o texto do usuário, detectando sinais de estresse e recomendando micro-ações (como pausas, exercícios de respiração, etc.).

## Funcionalidades (Sprint MVP)

Este protótipo foca-se em validar a estrutura da aplicação e a experiência do usuário.

* **Onboarding:** Um fluxo de introdução simples para novos usuários.
* **Autenticação Completa:** Registro e Login com Email/Senha e Login Anônimo, tudo integrado com o **Firebase Authentication**.
* **Navegação por Abas (Tabs):** Uma barra de navegação flutuante personalizada (estilo iOS) com 4 seções principais.
* **HomeScreen:** Tela de boas-vindas com o botão principal de "Check-in" (que navega para a tela de check-in).
* **Monitor de Saúde (Demo):**
    * Implementa um **Sensor de Agitação** real, usando o **Acelerômetro** (`expo-sensors`) para medir o nível de agitação física do **celular**.
    * Inclui um *placeholder* para a futura conexão com smartwatches (Apple HealthKit / Google Fit).
* **Análises (Demo):**
    * Exibe um gráfico e métricas fictícias para demonstrar a visão do produto.
    * Apresenta um **pop-up (Modal)** na primeira visita, explicando que os dados são fictícios e qual é o plano futuro (conectar a dados reais de smartwatch e check-ins).
* **Configurações:**
    * Mostra os dados do perfil do usuário.
    * Inclui placeholders para gestão de notificações e privacidade.
    * Funcionalidade de **Logout**.

## Tech Stack

* **Framework:** React Native (Expo SDK 54)
* **Backend & Autenticação:** Firebase (Authentication & Firestore)
* **Navegação:** React Navigation (Stack e Bottom Tabs)
* **Sensores:** `expo-sensors` (para o Acelerômetro)
* **Ícones:** `@expo/vector-icons`

## Como Executar o Projeto

### Pré-requisitos

* Node.js (LTS)
* NPM
* Expo Go (instalado no seu **celular**)
* Uma conta do Firebase

### 1. Clonar o Repositório

```bash
git clone https://[URL_DO_SEU_REPOSITORIO]
cd NeuroBalance
````

### 2\. Instalar as Dependências

```bash
npm install
```

### 3\. Configurar o Firebase (Importante\!)

Este projeto requer uma configuração do Firebase para funcionar.

1.  **Acesse** o [Console do Firebase](https://firebase.google.com/) e crie um novo projeto.
2.  Ative os serviços de **Authentication** (com os provedores "Email/Senha" e "Anônimo") e **Firestore Database** (em modo de teste).
3.  **Registre** um novo "App Web" (ícone `</>`) nas configurações do projeto.
4.  O Firebase **fornecerá** um objeto de configuração.
5.  Crie um **arquivo** chamado `firebaseConfig.js` na raiz do projeto `NeuroBalance`.
6.  Cole o seguinte código dentro dele, substituindo pelas suas chaves:

<!-- end list -->

```javascript
// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// COLE A SUA CONFIGURAÇÃO DO FIREBASE AQUI
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_AUTH_DOMAIN_AQUI",
  projectId: "SEU_PROJECT_ID_AQUI",
  storageBucket: "SEU_STORAGE_BUCKET_AQUI",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID_AQUI",
  appId: "SEU_APP_ID_AQUI"
};

// Inicializa e exporta os serviços
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 4\. Iniciar o Servidor do Expo

```bash
npx expo start --clear
```

**Escaneie** o QR Code com o app Expo Go no seu **celular**.

## Visão Futura (Próximos Passos)

  * [ ] Implementar a gravação de voz na `CheckinScreen`.
  * [ ] Integrar uma API de IA (como a API da Gemini) para análise de sentimento (Voz para Texto).
  * [ ] Salvar os resultados do check-in (humor, estresse) no Firestore.
  * [ ] Substituir os dados fictícios da tela `Análises` pelos dados reais do Firestore.
  * [ ] Iniciar a integração com HealthKit (iOS) e Health Connect (Android).

<!-- end list -->

```
```