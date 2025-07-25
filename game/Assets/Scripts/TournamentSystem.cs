using System.Collections.Generic;
using Firebase.Firestore;

[FirestoreData]
public class Tournament
{
    [FirestoreProperty]
    public string Id { get; set; }
    
    [FirestoreProperty]
    public double PrizePool { get; set; }
    
    [FirestoreProperty]
    public List<string> PlayerIds { get; set; }
}

public class TournamentSystem : MonoBehaviour
{
    public void CreateTournament(double entryFee)
    {
        FirebaseFirestore db = FirebaseFirestore.DefaultInstance;
        Tournament tournament = new Tournament
        {
            PrizePool = entryFee * 1000 // Example player count
        };
        
        db.Collection("tournaments").AddAsync(tournament);
    }

    public void PayoutWinners(string tournamentId, Dictionary<int, string> winners)
    {
        double[] distribution = { 0.50, 0.30, 0.20 };
        
        for (int i = 0; i < winners.Count; i++)
        {
            double prizeAmount = GetPrizePool(tournamentId) * distribution[i];
            StartCoroutine(PayPalAPI.SendPayment(winners[i], prizeAmount));
        }
    }
}
