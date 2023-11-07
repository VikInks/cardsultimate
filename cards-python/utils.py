import requests


def streaming_download(url, filepath):
    """Download the file from the given URL and save it to the given filepath"""
    headers = {'Accept': 'application/json'}
    with requests.get(url, stream=True, headers=headers) as r:
        r.raise_for_status()
        with open(filepath, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
