{{- define "intellmeet.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "intellmeet.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name (include "intellmeet.name" .) | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{- define "intellmeet.labels" -}}
app.kubernetes.io/name: {{ include "intellmeet.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
