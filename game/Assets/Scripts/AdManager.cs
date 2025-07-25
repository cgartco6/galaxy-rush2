using UnityEngine;
using GoogleMobileAds.Api;

public class AdManager : MonoBehaviour
{
    private RewardedAd premiumAd;
    private const string AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917"; // Test ID

    void Start()
    {
        MobileAds.Initialize(initStatus => { });
        LoadPremiumAd();
    }

    private void LoadPremiumAd()
    {
        premiumAd = new RewardedAd(AD_UNIT_ID);
        premiumAd.LoadAd(new AdRequest.Builder().Build());
    }

    public void ShowPremiumAd()
    {
        if (premiumAd.IsLoaded())
        {
            premiumAd.Show();
            premiumAd.OnUserEarnedReward += (sender, args) => {
                PlayerEconomy.AddGames(3);
                PlayerEconomy.AddCredits(50);
            };
        }
        else
        {
            Debug.Log("Ad not ready");
        }
    }
}
