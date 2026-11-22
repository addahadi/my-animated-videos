import av, numpy as np, sys
for i in (4, 5):
    with av.open(f"videos/GTA_6/inputs/audio{i}.ogg") as c:
        x = np.concatenate([f.to_ndarray().mean(0) for f in c.decode(audio=0)])
    sr = 48000; w = int(0.1*sr)
    db = [20*np.log10(np.sqrt((x[k:k+w]**2).mean())+1e-9) for k in range(0, len(x)-w, w)]
    print(i, "peak dBFS %.1f" % (20*np.log10(abs(x).max())), " ".join("%d" % d for d in db[:25]))
