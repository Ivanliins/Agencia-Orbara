"""Cliente mínimo da API REST do Google Ads (Agência Orbara).

As chaves vêm de variáveis de ambiente — nunca ficam no repositório:
  GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET,
  GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_LOGIN_CUSTOMER_ID (opcional)

Teste: python3 tools/google-ads/gads.py  → lista as contas acessíveis.
"""
import json, os, sys, urllib.error, urllib.parse, urllib.request

VERSION = os.environ.get("GADS_VERSION", "v22")
REQUIRED = ["GOOGLE_ADS_DEVELOPER_TOKEN", "GOOGLE_ADS_CLIENT_ID", "GOOGLE_ADS_CLIENT_SECRET", "GOOGLE_ADS_REFRESH_TOKEN"]


def env():
    missing = [k for k in REQUIRED if not os.environ.get(k)]
    if missing:
        sys.exit("Faltam variáveis de ambiente: " + ", ".join(missing))
    return os.environ


def token():
    e = env()
    data = urllib.parse.urlencode({"client_id": e["GOOGLE_ADS_CLIENT_ID"], "client_secret": e["GOOGLE_ADS_CLIENT_SECRET"],
                                   "refresh_token": e["GOOGLE_ADS_REFRESH_TOKEN"], "grant_type": "refresh_token"}).encode()
    try:
        r = urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=data), timeout=20)
    except urllib.error.HTTPError as err:
        sys.exit(f"OAuth falhou: {err.code} {err.read().decode()[:300]}")
    return json.load(r)["access_token"]


def call(method, path, body=None, login=True, tok=None):
    e = env()
    h = {"Authorization": f"Bearer {tok}", "developer-token": e["GOOGLE_ADS_DEVELOPER_TOKEN"], "Content-Type": "application/json"}
    if login and e.get("GOOGLE_ADS_LOGIN_CUSTOMER_ID"):
        h["login-customer-id"] = e["GOOGLE_ADS_LOGIN_CUSTOMER_ID"].replace("-", "")
    req = urllib.request.Request(f"https://googleads.googleapis.com/{VERSION}/{path}",
                                 data=json.dumps(body).encode() if body is not None else None, headers=h, method=method)
    try:
        return json.load(urllib.request.urlopen(req, timeout=40))
    except urllib.error.HTTPError as err:
        return {"__error__": err.code, "body": json.loads(err.read().decode() or "{}")}


def search(customer_id, gaql, tok):
    return call("POST", f"customers/{customer_id}/googleAds:search", {"query": gaql}, tok=tok)


if __name__ == "__main__":
    t = token()
    print(json.dumps(call("GET", "customers:listAccessibleCustomers", login=False, tok=t), indent=1))
