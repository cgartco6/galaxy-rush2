const functions = require('firebase-functions');
const admin = require('firebase-admin');
const paypal = require('paypal-rest-sdk');

admin.initializeApp();
paypal.configure({
  'mode': 'sandbox',
  'client_id': 'YOUR_CLIENT_ID',
  'client_secret': 'YOUR_CLIENT_SECRET'
});

// Player registration with demographics
exports.registerPlayer = functions.https.onCall((data, context) => {
  const { email, password, country, province, town } = data;
  
  return admin.auth().createUser({ email, password })
    .then(userRecord => {
      return admin.firestore().collection('players').doc(userRecord.uid).set({
        email,
        country,
        province,
        town,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
});

// Automatic tournament payout
exports.payoutTournament = functions.firestore
  .document('tournaments/{tournamentId}')
  .onUpdate(async (change, context) => {
    const tournament = change.after.data();
    
    if (tournament.status === 'completed') {
      const winners = tournament.winners; // {1: 'player1', 2: 'player2', 3: 'player3'}
      const prizePool = tournament.prizePool;
      const distribution = [0.50, 0.30, 0.20];
      
      for (const [position, playerId] of Object.entries(winners)) {
        const prize = prizePool * distribution[position-1];
        const player = await admin.firestore().collection('players').doc(playerId).get();
        
        const payout = {
          "sender_batch_header": {
            "email_subject": "Galaxy Rush Tournament Prize"
          },
          "items": [{
            "recipient_type": "EMAIL",
            "amount": {
              "value": prize,
              "currency": "USD"
            },
            "receiver": player.data().paypalEmail,
            "note": `You placed ${position} in the tournament`
          }]
        };
        
        paypal.payout.create(payout, (error, payout) => {
          if (error) throw error;
          console.log(`Paid ${prize} to ${player.data().email}`);
        });
      }
    }
  });
