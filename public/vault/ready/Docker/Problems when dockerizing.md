1. **Building the docker image**
   Alpine DOES NOT work with Python Scientific libraries.
   Claude: *"Alpine + heavy Python packages is a terrible combination for development"*.
   Alpine Linux has persistent issues installing pandas due to compilation failures [Fail to install python pandas package on alpine image 3.7.2-alpine3.9 · Issue #381 · docker-library/python +2](https://github.com/docker-library/python/issues/381), and it takes much longer to install Pandas and Numpy.
   **Solution** 
   Use a Debian Based Dockerfile:
   ```python # your code goes here print("Hello, World!")
	FROM python:3.9-slim
	...
    ```

	Some other problems come from what you ignore in your ***.dockerignore*** file. Be careful!!

2. **An already used port**         
   If a port is already being used it will show this message:
   *docker: Error response from daemon: failed to set up container networking: driver failed programming external connectivity on endpoint xenodochial_einstein (d2a34b87ea4cb89d11bf99251bf2ad6eeed51400fc4a1bdc4d25ad45a045fd7c): Bind for 0.0.0.0:8501 failed: ==port is already allocated*==
   **Solution**
   ```bash
	docker ps # See all running containers
	docker stop CONTAINER_ID _ # Stop any container by ID
	```

3. **The very first command**
   You shouldn't have ==**imports before** `st.set_page_config()`==. Even though if they're not Streamlit imports, they're still loading modules that might trigger Streamlit initialization.
   
   So, the script shouldn't be this way:   

   ```python
	import streamlit as st
	
	# THIS MUST BE THE VERY FIRST STREAMLIT COMMAND
	st.set_page_config(
	    page_title="Electrical Calculator",
	    page_icon="⚡",
	    layout="wide"
	)
	
	# NOW do sys.path and other imports
	import sys
	import os
	sys.path.append(os.path.dirname(os.path.abspath(__file__)))
	
	# Import your modules AFTER page config
	from views.base_view import BaseView
	from app.router import AppRouter
	```
  
   But this way:  

   ```python
	import sys
	import os
	sys.path.append(os.path.dirname(os.path.abspath(__file__)))
	
	"""Main application entry point"""
	import streamlit as st  # <-- First Streamlit import
	
	# THIS MUST BE THE VERY FIRST STREAMLIT COMMAND
	st.set_page_config(...)  # <-- But this might not be the first Streamlit command executed
	```

