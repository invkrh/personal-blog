---
title: Jupyter Guide
---

### Installation

* Install anaconda
* Add anaconda lib path to `PATH`
* Normally, jupyter is already installed.
* Check out jupyter kerel list `jupyter kernelspec list`

```bash
$ jupyter kernelspec list
Available kernels:
python3    /home/invkrh/lib/anaconda3/lib/python3.5/site-packages/ipykernel/resources

$ conda install notebook ipykernel # recommended

# alternative:
# python -m ipykernel.kernelspec
# jupyter kernelspec install-self --user # deprecated

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

### Use both python2 and python3

The idea here is to install multiple ipython kernels. Here are instructions for anaconda.

* Configure the python2.7 environment:

```bash
conda create -n py27 python=2.7 anaconda
source activate py27
conda install notebook ipykernel
ipython kernel install --user
```

* Configure the python3.5 environment:

```bash
conda create -n py35 python=3.5 anaconda
source activate py35
conda install notebook ipykernel
ipython kernel install --user
```

* Remove env
```bash
source deactivate
conda remove --name py27 --all
```

After that you should be able to choose between python2 and python3 when creating a new notebook in the interface.

Additionally you can pass the `--name` and `--display-name` options to ipython kernel install if you want to change the names of your kernels. See `ipython kernel install --help` for more informations.
