# Amplía x4 con Real-ESRGAN (ncnn, CPU) por mosaicos y reduce al ancho final con Lanczos.
# uso: python ampliar_ncnn.py <modelos_dir> <entrada> <salida.jpg> <ancho_final>
import sys, time, numpy as np, ncnn
from PIL import Image
mdir, ent, sal, ancho = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
net = ncnn.Net(); net.opt.use_vulkan_compute = False; net.opt.num_threads = 4
net.load_param(f'{mdir}/realesrgan-x4plus.param'); net.load_model(f'{mdir}/realesrgan-x4plus.bin')
img = np.asarray(Image.open(ent).convert('RGB')).astype(np.float32) / 255.0
H, W, _ = img.shape; s = 4; T = 192; P = 12
out = np.zeros((H * s, W * s, 3), np.float32); t0 = time.time(); n = 0
total = ((H + T - 1) // T) * ((W + T - 1) // T)
for y in range(0, H, T):
    for x in range(0, W, T):
        y0, x0 = max(y - P, 0), max(x - P, 0); y1, x1 = min(y + T + P, H), min(x + T + P, W)
        tile = np.ascontiguousarray(img[y0:y1, x0:x1].transpose(2, 0, 1))
        ex = net.create_extractor(); ex.input('data', ncnn.Mat(tile))
        _, o = ex.extract('output'); r = np.array(o).transpose(1, 2, 0)
        oy, ox = (y - y0) * s, (x - x0) * s; hh, ww = min(T, H - y) * s, min(T, W - x) * s
        out[y*s:y*s+hh, x*s:x*s+ww] = r[oy:oy+hh, ox:ox+ww]; n += 1
        if n % 10 == 0: print(f'{n}/{total} {time.time()-t0:.0f}s', flush=True)
g = Image.fromarray((np.clip(out, 0, 1) * 255).round().astype(np.uint8))
tam = (ancho, round(H * ancho / W))
ia = g.resize(tam, Image.LANCZOS)
# 30 % de ampliación clásica para conservar la textura natural (piedra, pasto)
clasica = Image.open(ent).convert('RGB').resize(tam, Image.LANCZOS)
Image.blend(ia, clasica, 0.3).save(sal, quality=95, subsampling=0)
print('listo', sal, f'{time.time()-t0:.0f}s')
