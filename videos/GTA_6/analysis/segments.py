import av, numpy as np
for i in range(1, 10):
    with av.open(f"videos/GTA_6/inputs/audio{i}.ogg") as c:
        x = np.concatenate([f.to_ndarray().mean(0) for f in c.decode(audio=0)])
    sr = 48000; w = int(0.01*sr)
    db = np.array([20*np.log10(np.sqrt((x[k:k+w]**2).mean())+1e-9) for k in range(0, len(x)-w, w)])
    on = db > -38
    segs = []; k = 0
    while k < len(on):
        if on[k]:
            j = k
            while j < len(on) and on[j]: j += 1
            segs.append([k/100, j/100]); k = j
        else: k += 1
    merged = []
    for s in segs:
        if merged and s[0] - merged[-1][1] < 0.2: merged[-1][1] = s[1]
        else: merged.append(s)
    print(i, round(len(x)/sr, 3), [(round(a,2), round(b,2)) for a, b in merged if b - a > 0.04])
