# Lux Convert - Professional File Converter

A modern, professional file conversion application built with Next.js, TypeScript, and Tailwind CSS. Supports image and audio file conversion with cloud storage integration.

## Features

- **300+ Supported Formats**: Convert between various image and audio formats
- **Cloud Storage Integration**: Connect to Dropbox and Google Drive
- **Fast & Secure**: Client-side processing with encryption
- **Modern UI**: Beautiful, responsive design with animations
- **Batch Processing**: Convert multiple files simultaneously
- **Custom Settings**: Adjust quality, compression, and output formats
- **Cross-Platform**: Works on desktop, mobile, and tablet

## Supported Formats

### Image Formats
- **Input**: JPEG, JPG, PNG, WebP, GIF
- **Output**: JPEG, PNG, WebP

### Audio Formats
- **Input**: MP3, WAV, OGG, FLAC, AAC
- **Output**: MP3, WAV, OGG

## Tech Stack

- **Framework**: Next.js 16.1.6
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, Headless UI
- **Animations**: Framer Motion
- **File Processing**: Browser Image Compression, Sharp
- **Cloud Storage**: Dropbox API, Google Drive API
- **Icons**: Lucide React

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/lux-convert.git
   cd lux-convert
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```

4. **Configure API keys**
   Edit `.env.local` and add your API keys:
   ```env
   # Dropbox App Configuration
   NEXT_PUBLIC_DROPBOX_CLIENT_ID=your_dropbox_app_key_here
   NEXT_PUBLIC_DROPBOX_REDIRECT_URI=http://localhost:3000/auth/dropbox/callback

   # Google Drive API Configuration
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
   NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
   ```

## API Setup

### Dropbox Integration

1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Create a new app with "Scoped access"
3. Add the following permissions:
   - `files.read`
   - `files.metadata.read`
4. Set your redirect URI: `http://localhost:3000/auth/dropbox/callback`
5. Copy your App Key to `.env.local`

### Google Drive Integration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Drive API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy your Client ID to `.env.local`

## Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
lux-convert/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # UI components
│   ├── Header.tsx        # Header component
│   ├── Dropzone.tsx      # File upload area
│   ├── FileItem.tsx      # File item component
│   └── Footer.tsx        # Footer component
├── lib/                  # Utility libraries
│   ├── cloudStorage.ts   # Cloud storage integrations
│   ├── imageUtils.ts     # Image processing utilities
│   └── utils.ts          # General utilities
├── hooks/                # Custom React hooks
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## Key Components

### Cloud Storage Integration
- **DropboxIntegration**: Handle Dropbox API calls
- **GoogleDriveIntegration**: Handle Google Drive API calls
- **FileUtilities**: Enhanced file processing utilities

### Enhanced UI Components
- **Toast**: Animated notification system
- **ProgressBar**: Animated progress indicators
- **FilePreview**: File preview with progress tracking
- **CloudStorageButton**: Cloud service connection buttons
- **AnimatedCard**: Cards with entrance animations
- **LoadingSpinner**: Custom loading animations

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_DROPBOX_CLIENT_ID` | Dropbox App Key | Yes |
| `NEXT_PUBLIC_DROPBOX_REDIRECT_URI` | Dropbox OAuth callback | Yes |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google Client ID | Yes |
| `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` | Google OAuth callback | Yes |
| `MAX_FILE_SIZE` | Maximum file size in bytes | No |
| `ALLOWED_FILE_TYPES` | Comma-separated file types | No |

## Security Features

- Client-side file processing (no server uploads required)
- Encrypted data transmission
- OAuth 2.0 authentication for cloud services
- File type validation
- Size restrictions
- CORS protection

## Performance Optimizations

- Lazy loading of components
- Image optimization with Next.js
- Efficient file processing
- Minimal bundle size
- Optimized animations with Framer Motion

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@luxconvert.com or visit our [documentation](https://docs.luxconvert.com).

## Roadmap

- [ ] Video format support
- [ ] PDF conversion
- [ ] Advanced image editing
- [ ] Batch download as ZIP
- [ ] API endpoints for developers
- [ ] Mobile app development
- [ ] Cloud processing options
- [ ] Advanced compression algorithms

---

Made with ❤️ by the Lux Convert Team
