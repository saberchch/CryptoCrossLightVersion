# Crypto Learning Platform - MVP

A modern, interactive platform for learning cryptocurrency fundamentals through quizzes and earning digital certificates.

## 🚀 Features

- **Interactive Quizzes**: Multiple-choice and true/false questions covering crypto topics
- **Digital Certificates**: PDF certificates for successful quiz completion
- **Progress Tracking**: Real-time quiz progress and answer review
- **Admin Panel**: Basic quiz management interface
- **Responsive Design**: Modern UI built with Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CryptoCross_lightv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
crypto-learning-platform/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Main layout with navigation
│   ├── page.tsx           # Homepage with quiz listing
│   ├── quiz/[id]/         # Quiz pages
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # Reusable React components
├── data/                  # Quiz data (JSON files)
├── lib/                   # Utility functions
└── public/                # Static assets
```

## 🎯 Core User Flow

1. **Homepage** → Browse available quizzes
2. **Quiz Page** → Answer questions with timer
3. **Results Page** → View score and detailed review
4. **Certificate** → Download PDF certificate (if passed)

## 📊 Quiz Management

### Adding New Quizzes

Currently, quizzes are managed through the `data/quizzes.json` file:

```json
{
  "id": "unique-quiz-id",
  "title": "Quiz Title",
  "description": "Quiz description",
  "difficulty": "Beginner|Intermediate|Advanced",
  "duration": 15,
  "passingScore": 70,
  "questions": [
    {
      "id": 1,
      "question": "Question text?",
      "type": "multiple-choice|true-false",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 0,
      "explanation": "Explanation text"
    }
  ]
}
```

### Quiz Structure

- **ID**: Unique identifier for the quiz
- **Title**: Display name for the quiz
- **Description**: Brief description of quiz content
- **Difficulty**: Beginner, Intermediate, or Advanced
- **Duration**: Time limit in minutes
- **Passing Score**: Minimum percentage to pass
- **Questions**: Array of question objects

## 🎨 Customization

### Styling

The platform uses Tailwind CSS with custom crypto-themed colors:

- Primary: `#3B82F6` (Blue)
- Secondary: `#1E40AF` (Dark Blue)
- Success: `#10B981` (Green)
- Danger: `#EF4444` (Red)

### Adding New Question Types

Extend the `Question` component in `components/Question.tsx` to support additional question types.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Setup

No environment variables are required for the MVP. In production, you'll want to add:

- Database connection strings
- Authentication secrets
- API keys for external services

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📈 Future Enhancements

### Phase 2 Features

- **User Authentication**: User accounts and login system
- **Database Integration**: PostgreSQL or MongoDB for data persistence
- **Advanced Analytics**: Detailed performance tracking
- **Social Features**: Leaderboards and achievements
- **Mobile App**: React Native mobile application

### Phase 3 Features

- **Web3 Integration**: Blockchain-based certificates
- **Token Rewards**: Cryptocurrency rewards for completion
- **NFT Certificates**: Non-fungible token certificates
- **Decentralized Storage**: IPFS for certificate storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Check the documentation
- Review the code examples

## 🎉 Acknowledgments

- Built with Next.js 14 and React
- Styled with Tailwind CSS
- PDF generation with jsPDF
- Icons from Heroicons

---

**Happy Learning! 🚀**
# CryptoCrossLightVersion
