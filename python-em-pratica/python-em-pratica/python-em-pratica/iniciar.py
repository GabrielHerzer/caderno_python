"""Servidor local opcional para o material de estudo, sem dependências externas."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Timer
import webbrowser

if __name__ == '__main__':
    pasta = Path(__file__).resolve().parent
    handler = partial(SimpleHTTPRequestHandler, directory=str(pasta))
    try:
        server = ThreadingHTTPServer(('127.0.0.1', 8765), handler)
    except OSError:
        print('Nao foi possivel usar a porta 8765. Feche uma abertura anterior do site e tente novamente.')
        input('Pressione Enter para sair.')
        raise SystemExit(1)
    print('Python em pratica: http://127.0.0.1:8765')
    print('Mantenha esta janela aberta. Use Ctrl+C para encerrar.')
    Timer(0.5, lambda: webbrowser.open('http://127.0.0.1:8765')).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
