# Usa uma imagem base Python
FROM python:3.8.10-slim

# Copia o script Python para o contêiner
COPY . /app

# Define o diretório de trabalho
WORKDIR /app

# Copia o arquivo requirements.txt para o contêiner
COPY requirements.txt .

RUN pip install -r requirements.txt

# Expõe a porta utilizada
EXPOSE 8080

# Comando para executar o script Python
CMD ["python", "app.py"]