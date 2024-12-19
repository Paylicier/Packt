<div align="center">
<br>
  <img src="frontend/logo.svg" alt="Packt Logo" width="400"/>
  
  # Packt 📦
  
  A modern package tracking platform that lets you monitor all your shipments in one place
</div>

## Features ✨

- 🔍 **Multi-Carrier Support**
  - DHL
  - La Poste
  - Colissimo
  - Chronopost
  - Mondial Relay
  - Asendia
  - Add your own !
  
- 🎯 **Easy Tracking**
  - Detailed event history
  - Location tracking
  
- 🌓 **Modern (and beautiful) UI**
  - Dark/Light mode
  - Responsive design
  - Clean interface
  
- 🔗 **Package Sharing**
  - Generate share links
  - Import packages from links
  
- 💾 **Local Storage**
  - Offline access
  - No account needed
  - Data persistence

## Setup 🚀

### Backend

1. Edit vars in .dev.vars (or the production version if using on production)
2. Install and run the backend
```bash
cd backend
bun install
bunx wrangler dev
```

### Frontend
1.Change the ``API_BASE_URL`` in the page's js
2.Open index.html or serve it.

## API Documentation 📚

The backend API provides endpoints for:
- `/api/list` - Get list of supported carriers

Response:
```json
[
  {
    "name": "string",
    "icon": "string",
    "requiredFields": ["string"]
  }
]
```
- `/api/get` - Get tracking information

Reponse:
```json
{
  "trackingNumber": "string",
  "carrier": "string",
  "status": {
    "code": "string",
    "description": "string",
    "timestamp": "string",
    "location": "string"
  },
  "estimatedDelivery": "string",
  "events": [
    {
      "code": "string",
      "description": "string",
      "timestamp": "string",
      "location": "string"
    }
  ]
}
```


## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is available under a dual-license:

1. **Mozilla Public License 2.0 (MPL-2.0)**
   - For non-commercial use
   - For commercial use that complies with our Commercial Terms
   - [View MPL-2.0 License](LICENSE-MPL-2.0.txt)

2. **Commercial Terms**
   - Additional terms apply for commercial use
   - Requires integration with substantial services
   - Requires attribution and proper documentation
   - [View Commercial Terms](COMMERCIAL-TERMS.md)

Please review both licenses carefully before using this software. If you have any questions about licensing, please open an issue.

---

<div align="center">
  Built with ❤️ and 🌊 by Paylicier
</div>
