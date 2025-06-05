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
- **AI-Powered Processing**: Uses Deep Infra's LLM models for natural language understanding

<h2>How to set up 💻</h2>

<ol>
  <li>Have a Rocket.Chat server ready. If you don't have a server, see this <a href="https://docs.rocket.chat/docs/deploy-rocketchat">guide</a>.</li>
  
  <li style="margin-bottom: 1rem;">Install the Rocket.Chat Apps Engine CLI.</li>
  
```bash
npm install -g @rocket.chat/apps-cli
# Verify if the CLI has been installed
rc-apps -v
```

  <li style="margin-bottom: 1rem;">Clone the GitHub Repository</li>
    
```bash
git clone https://github.com/priyanshuharshbodhi1/rocket-mail.git
```
  
  <li style="margin-bottom: 1rem;">Install app dependencies</li>
  
```bash
cd rocket-mail
npm install
```
  
  <li style="margin-bottom: 1rem;">Set up Google Cloud Project for Gmail API</li>
  
  - Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
  - Enable the Gmail API in "APIs & Services" > "Library"
  - Configure OAuth Consent Screen with required scopes:
    - `https://www.googleapis.com/auth/gmail.readonly`
    - `https://www.googleapis.com/auth/gmail.send`
    - `https://www.googleapis.com/auth/gmail.compose`
  - Create OAuth credentials (Web application type)
  - Add authorized redirect URIs for your Rocket.Chat server

  <li style="margin-bottom: 1rem;">Get Deep Infra API Key</li>
  
  - Sign up at [Deep Infra](https://deepinfra.com/)
  - Obtain your API key from account settings
  
  <li style="margin-bottom: 1rem;">Deploy the app to the server</li>
  
```bash
rc-apps deploy --url <server_url> --username <username> --password <password>
```
  
  - If you are running the server locally, the default server_url is http://localhost:3000
  - username is the username of your admin user
  - password is the password of your admin user
  
  <li style="margin-bottom: 1rem;">Configure App Settings</li>
  
  In Rocket.Chat Administration > Apps > EmailBridgeNLP > Settings, configure:
  - OAuth Client ID
  - OAuth Client Secret  
  - OAuth Redirect URI
  - Deep Infra API Key
</ol>

<h2>Usage 💬</h2>

### Natural Language Commands
- **/rocket-mail find emails from John about the project deadline** - Search emails intelligently
- **/rocket-mail send an email to my boss about tomorrow's meeting** - Compose and send emails
- **/rocket-mail generate a report of my emails from last week** - Get detailed analytics
- **/rocket-mail summarize this thread and email it to the team** - Share thread summaries
- **/rocket-mail count how many emails I received on Friday** - Quick email statistics

### Standard Commands
- **/rocket-mail login** - Authenticate with your Gmail account
- **/rocket-mail logout** - Disconnect your email account
- **/rocket-mail help** - Display comprehensive help
- **/rocket-mail sendemail <recipient> <subject> <message>** - Send structured emails
- **/rocket-mail report <days>** - Generate email reports for specified time period
- **/rocket-mail add <name> <email>** - Add contacts for easy reference
- **/rocket-mail delete <name>** - Remove saved contacts
- **/rocket-mail list** - View all your saved contacts

<h2>Architecture & Technical Details 🔧</h2>

### Key Components
- **Gmail API Integration**: Secure OAuth-based authentication and email operations
- **Natural Language Processing**: Deep Infra LLM integration for command understanding
- **Contact Management**: Local storage system for quick contact reference
- **Analytics Engine**: Email pattern analysis and reporting capabilities
- **Thread Summarization**: AI-powered conversation summarization

### Prerequisites
- Node.js (v14+)
- npm (v6+)
- Rocket.Chat server (local or remote)
- Google Cloud project with Gmail API access
- Deep Infra account for LLM processing

<h2>Development & Debugging 🐛</h2>

### Local Development
```bash
# Deploy with hot reload for development
rc-apps deploy --url http://localhost:3000 -u <username> -p <password> --update
```

### Troubleshooting
- Check logs in Rocket.Chat Administration > View Logs  
- Set app log level to "Debug" in Administration > Apps > EmailBridgeNLP > Settings
- Verify Gmail API quotas and OAuth configuration
- Ensure Deep Infra API key is valid and has sufficient credits

<h2>Roadmap 🗺️</h2>

### Features in Development
- Support for additional email providers (Outlook, Yahoo, IMAP/SMTP)
- Enhanced natural language processing capabilities
- Advanced email analytics and insights
- Email attachment retrieval and processing
- Mobile-optimized interface improvements

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
