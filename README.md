# Macrohard


# Frontend

cd ./Frontend_new
npm i
npm run dev

# backend

chmod +x setup_and_deploy.sh
sudo ./setup_and_deploy.sh
cd ./backend
pip install -r requirements.txt
flask run --host=0.0.0.0 --port=5000