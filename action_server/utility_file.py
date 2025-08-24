from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import pandas as pd
import os

load_dotenv(override=True)

engine = create_engine(f"postgresql+psycopg2://{os.getenv("username", None)}:{os.getenv("password", None)}@{os.getenv("database_url", None)}:{os.getenv("port", None)}/{os.getenv("database", None)}")

def get_all_devices():

    sql_string = """
    select count(distinct(service_tag_number)) from inventory.inventory
    """

    counts = pd.read_sql(text(sql_string), engine)
    return counts.to_dict("records")[0]


def get_deployed_devices():

    sql_string = """
    select count(distinct(service_tag_number)) from inventory.inventory where lower(status) like '%deploy%'
    """

    counts = pd.read_sql(text(sql_string), engine)
    return counts.to_dict("records")[0]

def get_stock_devices():

    sql_string = """
    select count(distinct(service_tag_number)) from inventory.inventory where lower(status) like '%stock%'
    """

    counts = pd.read_sql(text(sql_string), engine)
    return counts.to_dict("records")[0]

def get_stock_devices_detailed():

    sql_string = """
    select * from inventory.inventory where lower(status) like '%stock%'
    """

    counts = pd.read_sql(text(sql_string), engine)
    return counts.to_dict("records")
    

def get_eow_devices():

    sql_string = """
    select count(distinct(service_tag_number)) from inventory.inventory where lower(warranty_status) like '%eow%'
    """

    counts = pd.read_sql(text(sql_string), engine)
    return counts.to_dict("records")[0]


def get_deployedModel_view():

    sql_string = """
    select make_model, count(*) 
    from inventory.inventory
    where lower(status) like '%deploy%'
    group by make_model
    """
    
    counts = pd.read_sql(text(sql_string), engine).values
    return {i[0]: i[1] for i in counts}

def get_stockModel_view():

    sql_string = """
    select make_model, count(*) 
    from inventory.inventory
    where lower(status) like '%stock%'
    group by make_model
    """
    
    counts = pd.read_sql(text(sql_string), engine).values
    return {i[0]: i[1] for i in counts}

def get_deployedModel_subStatus():

    sql_string = """
    select sub_status, count(*) 
    from inventory.inventory
    where lower(status) like '%deploy%'
    group by sub_status
    """
    
    counts = pd.read_sql(text(sql_string), engine).values
    return {i[0]: i[1] for i in counts}

def get_stockModel_subStatus():

    sql_string = """
    select sub_status, count(*) 
    from inventory.inventory
    where lower(status) like '%stock%'
    group by sub_status
    """
    
    counts = pd.read_sql(text(sql_string), engine).values
    return {i[0]: i[1] for i in counts}

def add_resource_allocation(data):

    sample_frame = pd.DataFrame([data])
    col_mappings = {
        "name": "name",
        "serialNumber": "service_tag_number",
        "allocationDate": "allocation_date",
        "po": "cost_center",
        "location": "location",
        "email": "email",
        "details": "details"
    }
    sample_frame = sample_frame.rename(columns=col_mappings)
    with engine.begin() as conn:
        sample_frame.to_sql("resources_allocation_all", schema = "inventory", con = conn, if_exists="append", index=False)

    return {"status": "Success"}

def get_resource_allocation(data):
    
    name = data.get("name", None).lower()
    email = data.get("email", None).lower()

    sql_string = """
    select * from inventory.resources_allocation_all
    where lower(name) = :name and lower(email) = :email
    """

    with engine.begin() as conn:
        result = pd.read_sql(text(sql_string), conn, params={"name": name, "email": email})

    return result.to_dict("records")

def get_serialnumber_allocation(data):

    serialnumber = data.get("serialnumber", None).lower()

    sql_string = """
    select * from inventory.resources_allocation_all
    where lower(service_tag_number) = :serialnumber
    """
    
    with engine.begin() as conn:
        result = pd.read_sql(text(sql_string), conn, params={"serialnumber": serialnumber})
    
    return result.to_dict("records")[0]

def update_resource_allocation(data):
    
    serialnumber = data.get("serialnumber", None).lower()
    name = data.get("name", None).lower()
    allocation_date = data.get("allocation_date", None)
    cost_center = data.get("cost_center", None)
    location = data.get("location", None)
    email = data.get("email", None)
    detail = data.get("detail", None)
    sql_string = """
    update inventory.resources_allocation_all
    set name = :name,
    allocation_date = :allocation_date,
    cost_center = :cost_center,
    location = :location,
    email = :email,
    detail = :detail
    where lower(service_tag_number) = :serialnumber
    """
    with engine.begin() as conn:
        conn.execute(text(sql_string), parameters={"serialnumber": serialnumber, "name": name, "allocation_date": allocation_date, "cost_center": cost_center, "location": location, "email": email, "detail": detail})
    
    return {"status": "Success"}

def delete_resources(data):
    
    serialnumber = data.get("serialnumber", None).lower()

    sql_string = """
    delete from inventory.resources_allocation_all
    where lower(service_tag_number) = :serialnumber
    """
    with engine.begin() as conn:
        conn.execute(text(sql_string), parameters={"serialnumber": serialnumber})
    
    return {"status": "Success"}

def show_eow_resources():

    sql_string = """
    select * from inventory.inventory
    where lower(warranty_status) like '%eow%'
    order by year desc
    """
    with engine.begin() as conn:
        result = pd.read_sql(text(sql_string), conn)
    return result.to_dict("records")


