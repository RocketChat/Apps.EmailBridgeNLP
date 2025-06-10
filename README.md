<div align="center">
<img width=30% src="https://github.com/user-attachments/assets/a92f27b9-5101-4725-8311-a0e6ada0edc7" alt="rocket-mail-illustration">
</div>

<h1 align="center">Rocket.Chat Email Integration App</h1>

Say goodbye to context switching between your email client and team chat! With Rocket Mail, managing emails becomes as natural as having a conversation. This powerful Rocket.Chat app transforms your email workflow using AI-powered natural language commands, keeping you in the flow of collaboration.

<div align="center">
    <img width=60% src="https://github.com/user-attachments/assets/a8f4c5b3-9e2a-4c6d-8f1b-d2e3a4b5c6d7">
</div>

<h2>Features 🚀</h2>

- **Natural Language Email Commands**: Simply ask for emails, send messages, or generate reports using everyday language
- **Smart Email Summaries**: Get AI-powered summaries of email threads and conversations 
- **Intelligent Contact Management**: Save contacts and refer to them by name in your commands
- **Comprehensive Email Analytics**: Detailed insights about your email habits and inbox health
- **Thread Integration**: Summarize Rocket.Chat threads and email them to your team
- **Gmail Integration**: Seamless connection with Gmail using OAuth authentication

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

### Natural Language Commands
- **/rocket-mail send an email to my boss about tomorrow's meeting** - Compose and send emails
- **/rocket-mail generate a report of my emails from last week** - Get detailed analytics
- **/rocket-mail summarize this thread and email it to the team** - Share thread summaries
- **/rocket-mail count how many emails I received on Friday** - Quick email statistics

### Standard Commands
- **/rocket-mail login/logout** - Authenticate with your Gmail account
- **/rocket-mail help** - Display comprehensive help
- **/rocket-mail report <days>** - Generate email reports for specified time period

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

---

<div align="center">
Built with ❤️ for the Rocket.Chat community by EmailBridgeNLP
</div>
