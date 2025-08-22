from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utility_file import *

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/test")
def get_health_check():
    """
    Get the health check status of the application.

    Returns:
        dict: A dictionary containing the status of the application.
    """

    return {"status": "app working as expected"}


@app.post("/getAllDevices")
def getAllDevices():
    """
    Get all deployed devices.

    Returns:
        dict: A dictionary containing the count of deployed devices.
    """

    try:
        print("Request for getAllDevices")
        return get_all_devices()
    except Exception as e:
        print(f"Error encountered in get_all_devices: {e}")
        return {"count": None}


@app.post("/getDeployedDevices")
def getDeployedDevices():
    """
    Get the count of deployed devices.

    Returns:
        dict: A dictionary containing the count of deployed devices.
    """

    try:
        print("Request for getDeployedDevices")
        return get_deployed_devices()
    except Exception as e:
        print(f"Error encountered in get_deployed_devices: {e}")
        return {"count": None}


@app.post("/getStockDevices")
def getStockDevices():
    """
    Get the count of stock devices.

    Returns:
        dict: A dictionary containing the count of stock devices.
    """

    try:
        print("Request for getStockDevices")
        return get_stock_devices()
    except Exception as e:
        print(f"Error encountered in get_stock_devices: {e}")
        return {"count": None}


@app.post("/getEowDevices")
def getEowDevices():
    """
    Get the count of EOW devices.

    Returns:
        dict: A dictionary containing the count of EOW devices.
    """

    try:
        print("Request for getEowDevices")
        return get_eow_devices()
    except Exception as e:
        print(f"Error encountered in get_eow_devices: {e}")
        return {"count": None}


@app.post("/getDeployedModelView")
def getDeployedModelView():
    """
    Get the count of deployed devices by model.

    Returns:
        dict: A dictionary containing the count of deployed devices by model.
    """

    try:
        print("Request for getDeployedModelView")
        return get_deployedModel_view()
    except Exception as e:
        print(f"Error encountered in get_deployedModel_view: {e}")
        return {"Mac": None}


@app.post("/getStockModelView")
def getStockModelView():
    """
    Get the count of stock devices by model.

    Returns:
        dict: A dictionary containing the count of stock devices by model.
    """
    try:
        print("Request for getStockModelView")
        return get_stockModel_view()
    except Exception as e:
        print(f"Error encountered in get_stockModel_view: {e}")
        return {"Mac": None}

@app.post("/getDeployedModelSubStatus")
def getDeployedModelSubStatus():
    """
    Get the count of deployed devices by substatus.

    Returns:
        dict: A dictionary containing the count of deployed devices by substatus.
    """
    try:
        print("Request for getDeployedModelSubStatus")
        return get_deployedModel_subStatus()
    except Exception as e:
        print(f"Error encountered in get_deployedModel_subStatus: {e}")
        return {"Mac": None}

@app.post("/getStockModelSubStatus")
def getStockModelSubStatus():
    """
    Get the count of stock devices by substatus.

    Returns:
        dict: A dictionary containing the count of stock devices by substatus.
    """
    try:
        print("Request for getStockModelSubStatus")
        return get_stockModel_subStatus()
    except Exception as e:
        print(f"Error encountered in get_stockModel_subStatus: {e}")
        return {"Mac": None}

@app.post("/addResourceAllocation")
def addResourceAllocation(data: dict):
    try:
        print("Request for addResourceAllocation")
        return add_resource_allocation(data)
    except Exception as e:
        print(f"Error encountered in add_resource_allocation: {e}")
        return {"status": "Failed"}

@app.post("/getResourceAllocation")
def getResourceAllocation(data: dict):
    try:
        print("Request for getResourceAllocation")
        return get_resource_allocation(data)
    except Exception as e:
        print(f"Error encountered in get_resource_allocation: {e}")
        return {"status": "Failed"}
        
@app.post("/getSerialnumberAllocation")
def getSerialnumberAllocation(data: dict):
    try:
        print("Request for getSerialnumberAllocation")
        return get_serialnumber_allocation(data)
    except Exception as e:
        print(f"Error encountered in get_serialnumber_allocation: {e}")
        return {"status": "Failed"}

@app.post("/updateResourceAllocation")
def updateResourceAllocation(data: dict):
    try:
        print(data)
        print("Request for updateResourceAllocation")
        return update_resource_allocation(data)
    except Exception as e:
        print(f"Error encountered in update_resource_allocation: {e}")
        return {"status": "Failed"}