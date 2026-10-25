# Upload-content runtime configuration

The upload-content handler is import-safe and receives its filesystem and email
dependencies from `uploadContentRuntime.js`. The primary server validates this
configuration and prepares the upload root before it starts listening.

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Controls runtime logging and error detail only |
| `LPU_JOB_ENV` | Explicitly identifies `local`, `development`, or `production` operation |
| `CONTENT_UPLOAD_DIR` | Absolute directory used for isolated temporary upload workspaces |
| `ALLOW_PRODUCTION_JOB` | Must be `true` when `LPU_JOB_ENV=production` |

Example development values:

```bash
NODE_ENV=development
LPU_JOB_ENV=development
CONTENT_UPLOAD_DIR=/absolute/path/to/uploads
```

`USER` and `LOGNAME` never select the upload directory. Uploaded filenames are
sanitized and each request uses a separate temporary workspace beneath the
configured root.
