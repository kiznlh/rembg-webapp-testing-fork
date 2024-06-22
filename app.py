from flask import Flask, render_template, request, send_file, send_from_directory
from rembg import remove
from PIL import Image
from io import BytesIO



app = Flask(__name__,static_folder="./webui/dist", static_url_path="/")

@app.route('/',methods=['GET'])
def render():
   
    return app.send_static_file('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file uploaded', 400
        file = request.files['file']
        if file.filename == '':
            return 'No file selected', 400
        if file:
            input_image = Image.open(file.stream)
            output_image = remove(input_image, post_process_mask=True)
            img_io = BytesIO()
            output_image.save(img_io, 'PNG')
            img_io.seek(0)
            # return send_file(img_io, mimetype='image/png')  # Change download in separate browser tab
            return send_file(img_io, mimetype='image/png', as_attachment=True, download_name='_removeBG.png')

if __name__ == '__main__':
    app.run(host='127.0.0.1', debug=True, port= 5000)