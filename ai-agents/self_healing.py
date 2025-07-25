import requests
import os
import schedule
import time

SERVICES = {
    "game-server": "https://game.galaxyrush.com/ping",
    "payment-api": "https://pay.galaxyrush.com/status",
    "ai-agents": "https://ai.galaxyrush.com/health"
}

def check_services():
    for service, url in SERVICES.items():
        try:
            response = requests.get(url, timeout=5)
            if response.status_code != 200:
                restart_service(service)
        except:
            restart_service(service)

def restart_service(service):
    print(f"Restarting {service}")
    if service == "game-server":
        os.system("git pull origin main && firebase deploy --only hosting")
    elif service == "payment-api":
        os.system("docker restart payment-api")
    elif service == "ai-agents":
        os.system("pkill -f python && nohup python main.py &")
    
    send_alert(f"{service} restarted")

def send_alert(message):
    # Implement your alert system (email, Slack, etc.)
    print(f"ALERT: {message}")

schedule.every(15).minutes.do(check_services)

while True:
    schedule.run_pending()
    time.sleep(1)
