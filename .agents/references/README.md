# Agent Reference Index

These files record deployment and runtime decisions established while separating the development and production API deployments. Load the references that apply to the task before changing deployment configuration, PM2 processes, runtime environment selection, or Firebase initialization.

| Reference | Use it for |
| --- | --- |
| [deployment-topology.md](deployment-topology.md) | DreamHost hosts, ports, directory layout, release boundaries, and cutover topology |
| [development-operations.md](development-operations.md) | WebStorm SFTP uploads, the development PM2 process, logs, restarts, and troubleshooting |
| [production-releases.md](production-releases.md) | GitHub Actions releases, production bootstrap requirements, rollback, and retention |
| [firebase-runtime-targets.md](firebase-runtime-targets.md) | Firebase project/database selection, required environment variables, and safety guards |

Repository code, tests, workflow files, and the root `AGENTS.md` take precedence if behavior changes. Update the applicable reference when changing the architecture or operating procedure.

Do not store environment values, private keys, service-account JSON, or other secrets in these files.
