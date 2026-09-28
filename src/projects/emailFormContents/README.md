# Email form runtime

The `/email-form` endpoint sends RAFL pot-information submissions through the configured content email account. Server startup creates the component runtime and injects its handler into the route.

## Configuration

The endpoint is disabled unless explicitly enabled:

```dotenv
EMAIL_FORM_ENABLED=true
```

When enabled, it also requires the shared runtime settings:

```dotenv
LPU_JOB_ENV=local|development|production
ALLOW_PRODUCTION_JOB=true
```

`ALLOW_PRODUCTION_JOB=true` is required only when `LPU_JOB_ENV=production`. SMTP configuration is loaded from `EMAIL_CONFIG_PATH`; `raflEmailRecipients` is loaded from `users.js` under `DEPRECATED_KEYS_DIR` only while creating an enabled runtime.

If `EMAIL_FORM_ENABLED` is absent or `false`, the server still starts and `POST /email-form` returns `503` with the code `email_form_disabled`. Values other than `true` or `false` fail server startup as invalid configuration.

## Safety properties

- Importing the handler, configuration, or runtime does not load SMTP credentials or send email.
- Form state and submission timestamps are request-local.
- Multipart submissions are limited to 30 fields and 64 KiB of field data; files are rejected.
- `subjectText` is required, bounded, and cannot contain line breaks.
- User-provided field names and values are escaped before generating HTML.
- The handler awaits email delivery before returning success and does not log submitted form content.
