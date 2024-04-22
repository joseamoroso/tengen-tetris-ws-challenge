# wschallenge

![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.0.0](https://img.shields.io/badge/AppVersion-1.0.0-informational?style=flat-square)

A Helm chart to deploy tengen-tetris app. Current implementation, requires AWS settings like AWS load balancer controller and EFS CSI driver to enable the ingress and volume features.

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` | Affinity for pods. |
| appPort | int | `8080` | Port on which the application listens. |
| autoscaling.enabled | bool | `true` | Specifies whether autoscaling should be enabled. |
| autoscaling.maxReplicas | int | `10` | Maximum number of replicas. |
| autoscaling.minReplicas | int | `2` | Minimum number of replicas. |
| autoscaling.targetCPUUtilizationPercentage | int | `70` | Target CPU utilization percentage. |
| autoscaling.targetMemoryUtilizationPercentage | int | `70` | Target memory utilization percentage. |
| env | list | `[{"name":"DB_FILENAME","value":"/data/database.db"},{"name":"ADDRESS","value":"0.0.0.0"}]` | Environment variables for the application. |
| env[0] | object | `{"name":"DB_FILENAME","value":"/data/database.db"}` | Name of the SQLite database file. |
| env[1] | object | `{"name":"ADDRESS","value":"0.0.0.0"}` | Address on which the application listens. |
| fullnameOverride | string | `""` |  |
| image.pullPolicy | string | `"Always"` | Pull policy for the Docker image. |
| image.repository | string | `"jamorosoa/tengen-tetris-ws-challenge-gh"` | Repository of the Docker image. |
| image.tag | string | `"latest"` | Tag of the Docker image. |
| ingress.annotations | object | `{"alb.ingress.kubernetes.io/scheme":"internet-facing","alb.ingress.kubernetes.io/target-type":"ip"}` | Annotations for the ingress. Current configuration suports AWS Load Balancer controller for ingress. |
| ingress.className | string | `"alb"` | Ingress class name. |
| ingress.enabled | bool | `true` | Specifies whether ingress should be enabled. |
| ingress.hosts | list | `[{"host":"wschallenge1.joseamoroso.com","paths":[{"path":"/","pathType":"Prefix"}]}]` | Hosts and paths for the ingress. |
| nameOverride | string | `""` | Overrides names. |
| nodeSelector | object | `{}` | Node selector for pods. |
| podAnnotations | object | `{}` |  |
| replicaCount | int | `1` | Number of replicas for the application. |
| resources | object | `{"limits":{"cpu":"100m","memory":"256Mi"},"requests":{"cpu":"100m","memory":"128Mi"}}` | Resource requests and limits for the pods. |
| service.port | int | `80` |  |
| service.type | string | `"NodePort"` | Type of Kubernetes service. |
| tolerations | list | `[]` | Tolerations for pods. |
| volume | object | `{"enabled":true,"mountPath":"/data","name":"data","server":"fs-0d3b9e9f526f348d7"}` | Volume settings. Current configuration support EFS CSI driver |
| volume.enabled | bool | `true` | Specifies whether volume should be enabled. |
| volume.mountPath | string | `"/data"` | Path where the volume is mounted inside the container. |
| volume.name | string | `"data"` | Name of the volume. |
| volume.server | string | `"fs-0d3b9e9f526f348d7"` | Server information if using an external volume. This id correspond to EFS volume generated in AWS. E.g. fs-xxxxxxxxxxxxxx |

----------------------------------------------
Autogenerated from chart metadata using [helm-docs v1.13.1](https://github.com/norwoodj/helm-docs/releases/v1.13.1)