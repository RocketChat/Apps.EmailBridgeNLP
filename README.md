# EmailBridgeNLP
Natural Language Bridge to Legacy Email System for Rocket.Chat Powered by Modern LLMs

## Getting Started

<div align="center">
<img width=30% src="https://github.com/user-attachments/assets/a92f27b9-5101-4725-8311-a0e6ada0edc7" alt="rocket-mail-illustration">
</div>

<h1 align="center">Rocket.Chat Email Integration App</h1>

Say goodbye to context switching between your email client and team chat! With Rocket Mail, managing emails becomes as natural as having a conversation. This powerful Rocket.Chat app transforms your email workflow using AI-powered natural language commands, keeping you in the flow of collaboration.

<div align="center">
    <img width=60% src="https://github.com/user-attachments/assets/a8f4c5b3-9e2a-4c6d-8f1b-d2e3a4b5c6d7">
</div>


## 📜 Getting Started

### Prerequisites

-   You need a Rocket.Chat Server Setup
-   Rocket.Chat.Apps CLI,

*   In case you don't have run:
    ```sh
    npm install -g @rocket.chat/apps-cli
    ```

### ⚙️ Installation

-   Every RocketChat Apps runs on RocketChat Server, thus everytime you wanna test you need to deploy the app with this note. lets start setting up:

1. Clone the repo
    ```sh
    git clone https://github.com/<yourusername>/Apps.EmailBridgeNLP
    ```
2. Navigate to the project directory
    ```sh
    cd Apps.EmailBridgeNLP
    ```    
3. Install NPM packages
    ```sh
    npm ci
    ```
4. Deploy app using:

    ```sh
    rc-apps deploy --url <server_url> --username <username> --password <password>
    ```
      Where:
    - `<server_url>` is the URL of your Rocket.Chat workspace.
    - `<username>` is your username.
    - `<password>` is your password.

<h2>Usage 💬</h2>

👋 Need some help with your /email?

- **`/email help`**: Show this help message  
- **`/email login`**: Login to your email account  
- **`/email logout`**: Logout from your email account  
- **`/email config`**: Open user preferences and settings  
- **`/email report`**: Get daily email statistics report

Natural Language command exmples:

- **`/email summarize this thread/channel and send it as email to boss@rc.com who refuses to use chat`**: summarize thread/channel and send as email to specified recipient(s) 
- **`/email post in the channel for everyone the budget for 2025 email pdf received between 5/1/2025 and 6/24/2025`**: searchs the emails, extracts the attachment and upload it in channel. 
- **`/email please give me report for yesterday`**: Get daily email statistics report

### User Preferences Modal:
User can go to User Preferences by entering `/email config` or by clicking "User Preferences" button in helper message. User can config email provider, language, categories to keep in report , adding new categories etc in it.


<h2>Development & Debugging 🐛</h2>

### Local Development
```bash
# Deploy with hot reload for development
rc-apps deploy --url http://localhost:3000 -u <username> -p <password> --update
```

### Troubleshooting
- Check logs in Rocket.Chat Administration > View Logs  
- Set app log level to "Debug" in Administration > Apps > EmailBridgeNLP > Settings

### Prerequisites
- Node.js (v14+)
- npm (v6+)

<h2>🧑‍💻 Contributing</h2>

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue.

Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: adds some amazing feature'`)
4. Push to the Branch (`git push origin feat/AmazingFeature`)
5. Open a Pull Request

<h2>License 📄</h2>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<h2>Support 💬</h2>

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the [Rocket.Chat documentation](https://docs.rocket.chat/)
- Join the Rocket.Chat community discussions

