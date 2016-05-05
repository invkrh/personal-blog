---
title: Jupyter Guide
---

### Installation

* Install anaconda
* Add anaconda lib path to `PATH`
* Install jupyter
* `python -m IPython kernelspec install-self --user`

**Note:**
The last step is important, since it replaces python with the python from the conda env.
I think this will make the IPython kernel launch in that env's Python.
