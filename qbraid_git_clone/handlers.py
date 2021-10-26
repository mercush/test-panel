import os
import sys
import subprocess
import json
import boto3
import zipfile

from jupyter_core.paths import jupyter_config_dir

from jupyter_client.kernelspec import KernelSpecManager

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join

import tornado
from tornado.web import StaticFileHandler

pjoin = os.path.join


class GitClone(APIHandler):

    @tornado.web.authenticated
    def post(self): # clones a git repo into the specified directory
        # input_data is a dictionnary with a key "name"
        input_data = self.get_json_body()
        git_url = input_data.get("git_url")
        target_dir = input_data.get("target_dir")
        git_clone(git_url, target_dir)
        data = {} # add any info required for the frontend to sync with the backend post-repo-clone
        self.finish(json.dumps(data))



def setup_handlers(web_app, url_path):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    # Prepend the base_url so that it works in a jupyterhub setting
    git_clone_route = url_path_join(base_url, url_path, "git-clone")
    handlers = [
        (git_clone_route, GitClone)
    ]

    web_app.add_handlers(host_pattern, handlers)

    doc_url = url_path_join(base_url, url_path, "static")
    doc_dir = os.getenv(
        "QBRAID_STATIC_DIR",
        os.path.join(os.path.dirname(__file__), "static"),
    )
    handlers = [("{}/(.*)".format(doc_url), StaticFileHandler, {"path": doc_dir})]
    web_app.add_handlers(".*$", handlers)



def git_clone(git_url):
    clone="git clone "+git_url+" ~/qBraid_repositories/test/new"
    os.system(clone)
