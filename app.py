from flask import Flask, send_from_directory
import os

app = Flask(__name__)

# Главная страница
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Роут для языковых файлов
@app.route('/lang/<lang_code>.json')
def serve_lang(lang_code):
    lang_folder = os.path.join('.', 'lang')
    return send_from_directory(lang_folder, f'{lang_code}.json')

# Роут для остальных файлов (css, js, картинки)
@app.route('/<path:filename>')
def serve_file(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    app.run(debug=True)

