---
title: Jupyter Guide
---

### Installation

* Install anaconda
* Add anaconda lib path to `PATH`
* Install jupyter
* `python -m IPython kernelspec install-self --user`
* Check out jupyter kerel list `jupyter kernelspec list`
  ```bash
  $ jupyter kernelspec list
  Available kernels:
  python3    /home/invkrh/lib/anaconda3/lib/python3.5/site-packages/ipykernel/resources
  
  $ jupyter kernelspec install-self --user # alternative: python -m ipykernel.kernelspec
  
  $ jupyter kernelspec list
  Available kernels:
  python3    /home/invkrh/.local/share/jupyter/kernels/python3
  
  $ cat /home/invkrh/.local/share/jupyter/kernels/python3/kernel.json
  {
     "display_name": "Python 3",
     "language": "python",
     "argv": [
        "/home/invkrh/lib/anaconda3/bin/python",
        "-m",
        "ipykernel",
        "-f",
        "{connection_file}"
       ]
  }
  ```

Make sure `python` of `anaconda` version is used, thus we can import lots of anaconda package on-site.

More details [here](http://jupyter-client.readthedocs.io/en/latest/kernels.html#kernelspecs)

