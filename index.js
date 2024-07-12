const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://demo_user:Oz2cwgztDK11udWH@cluster0.vqdjsxe.mongodb.net/MyDataBase1?tls=true&retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const InterventionSchema = new mongoose.Schema({
  IdRDV: String,
  DateDebutRDV: Date,
  Client: {
    Nom: String,
    Prenom: String,
    Ville: String
    }
});

const Intervention = mongoose.model('Intervention', InterventionSchema);

app.post('/webhook', async (req, res) => {
    const intentName = req.body.queryResult.intent.displayName;
    const parameters = req.body.queryResult.parameters;

    if (intentName === 'InterventionInfo') {
        const reference = parameters['InterventionReference'];

        try {
            const intervention = await Intervention.findOne({ reference: reference });
            
            if (intervention) {
                const responseText = `Intervention ${intervention.IdRDV} créée le ${intervention.DateDebutRDV} pour le client ${intervention.Client.Prenom} ${intervention.Client.Nom} à l'adresse ${intervention.Client.Ville}`;
                res.json({ fulfillmentText: responseText });
            } else {
                res.json({ fulfillmentText: `Aucune intervention trouvée pour la référence ${reference}.` });
            }
        } catch (error) {
            res.status(500).send(error);
        }
    } else if (intentName === 'Greeting') {
        const responseText = 'Bonjour! Comment puis-je vous aider aujourd\'hui?';
        res.json({ fulfillmentText: responseText });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
