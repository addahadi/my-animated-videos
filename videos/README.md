# Future video projects

Create one folder per new video, using a descriptive name such as `neural-network-basics`.

Suggested structure:

```text
videos/
  neural-network-basics/
    brief.md
    script.md
    inputs/          Original recordings and supplied references
    analysis/        Draft transcripts and timing notes
    public/          Prepared narration, fonts, and other render assets
    src/             This video's scenes and timing data
    scripts/         This video's preparation, render, and check scripts
    output/          Previews, stills, final MP4, and verification results
    README.md        Commands and production notes for this video
```

Copy [the brief template](../templates/video-brief.md) into the new project as `brief.md` and fill it with the available information. Missing optional details can use the workspace defaults.

The first AI/ML/DL video remains in the workspace root at its existing paths. Its scripts are specific to its six recordings and scenes; creating a new folder alone does not make those scripts handle a new topic automatically. Each new project needs an explicit entry point, audio order, scene timings, and output destination.

Keep talking to Codex from the main `my-animated-video` workspace. Identify the video by its topic or folder name so work goes to the correct project.
