# DPaaS Service Broker on Bluemix
***
## Register your service broker
To register a service broker, you must provide **service broker definition** in a JSON file that defines the service broker. You can follow the format on [Service broker definition] [1].
  [1]: https://www.stage1.ng.bluemix.net/docs/#services/index-gentopic1.html#v2definition "Service broker definition"
Here is 'DPaaS' service broker definition json file:<br />
**Reg.json**
``` json 
{
    "name" : "DataPowerDev",    
    "broker_url" : "http://dpaas-broker.stage1.mybluemix.net",
    "auth_username": "admin",
    "auth_password": "smersh",
    "visibilities" : [ 
        {"organization_name" : "spcchiu@tw.ibm.com"},
        {"organization_name" : "liuch@tw.ibm.com"},
        {"organization_name" : "richchou@tw.ibm.com"},
        ...
        ...
    ]   
}    
```
**name**</br>
　　The name of the service broker. This name must be unique in Bluemix™.
    
**broker_url**</br>
　　The URL of the service broker implementation.
    
**auth_username**</br>
　　A user name that is included in HTTP basic authentication requests to the service broker.
    
**auth_password**</br>
　　A password that is included in HTTP basic authentication requests to the service broker.
    
**visibilities**</br>
　　If you want to enable developers to use this service, add with Bluemix account.</br>




## Command to register service broker

``` bash
$ path/cloudcli/bin/cloud-cli login
$ path/cloudcli/bin/cloud-cli create-service-broker reg.json
```


# Sample NG V2 Service Brokers

This is a set of sample NG V2 services which implement the /v2 paths.
This includes logic for catalog (GET), provision (PUT), bind (PUT), unbind (DELETE), unprovision (DELETE) and 
update service (PATCH).

Samples for [java] [1], [node] [2] and [ruby] [3] are provided 
  [1]: https://github.rtp.raleigh.ibm.com/bluemix/sample-services/tree/master/v2/java-v2 "java"
  [2]: https://github.rtp.raleigh.ibm.com/bluemix/sample-services/tree/master/v2/node-v2 "node"
  [3]: https://github.rtp.raleigh.ibm.com/bluemix/sample-services/tree/master/v2/ruby-v2 "ruby"

Pivotal documentation found here: [Pivotal doc] [4]
  [4]: http://docs.cloudfoundry.org/services/api.html "Pivotal doc"


## Basic Authentication
Each call into the service broker implementation has an http authorization header.
Each call should verify the value is as expected.  The user and password for this field
correspond to the values provided on the cli add-service-broker invocation. 

## Errors
In order to expose error text from a service broker for the provision, bind, unbind, unprovision and update entry points,
return a JSON object with a description entry.  This error text will be displayed in ACE when invoked due 
to an action in ACE.

### Sample JSON

```
{
    "description" : "Service failed due to invalid authorization"
}
```
  
## Get Catalog
This REST API will be called intermittently to refresh the list of service offerings and service plans

### URL
The URL path for the GET invoked within the service broker implementation is /v2/catalog

## Get Catalog Result
### Result
A status code of 200 is the expected successful value handled by the cloud controller code.

The fields returned from a catalog GET within the JSON result are as follows:
- services - an array of service definitions and their service plan definitions.  Each array entry consists of the following:
    - bindable - whether the service is bindable or not
    - dashboard_client - optional UAA client for this service.  When present, a service's dashboard_client must be unique.  This field is used to enable SSO.  The entry consists of the following:
        - id - The unique ID of the dashboard client
        - secret - The secret for the dashboard client id
        - redirect_uri - The URI used for redirection for SSO
    - description - service description
    - id - ID of the service.  Must be unique and should be a GUID and should not be changed once set.
      If you update the id of the service and there are related existing service instances, 
      this service will be considered as inactive by the Cloud Controller.
    - metadata - optional hash of values.  Valid JSON required if provided.  This now includes the ACE-related URL's for icons and instructions.
    - name - name of the service.  Must be unique.  This will be the service name presented on create-service.  Use lowercase and don't include spaces.
    - plan_updatable - optional Boolean whether service instances of the service are plan updateable.  Default value is false if omitted.
    - tags - optional string array of tags passed into the app for the service binding on VCAP_SERVICES
    - plans - array of service plan definitions.  Each array entry consists of the following:
        - description - service plan description
        - free - whether the service plan is free or not.  Default is true.  This arrives in CF release 164
        - id - ID of the service plan.  Must be unique and should be a GUID and should not be changed once set
          If you update the id of the service plan and there are related existing service instances, 
          this service plan will be considered as inactive by the Cloud Controller.
        - metadata - optional hash of values.  Valid JSON required if provided
        - name - name of the service plan.  Must be unique within the context of the service.  This will be the service plan name presented on create-service.  Use lowercase and don't include spaces.

### Sample JSON

```
{
    "services" :
    [
        {
            "bindable"         : true,
            "dashboard_client" :
            {
              "id"           : "TestRubyV2ServiceBroker",
              "secret"       : "TestRubyV2ServiceBrokerSecret",
              "redirect_uri" : "http://10.0.1.2/sso_dashboard"
            },
            "description"      : "Test V2 Service Broker Description",
            "id"               : "service-guid-here",
            "metadata"         : 
            {
              "displayName       : "Test V2 Service Broker Display Name",
              "documentationUrl" : "http://10.0.1.2/documentation.html,
              "featuredImageUrl" : "http://10.0.1.2/servicesample64.png",
              "imageUrl"         : "http://10.0.1.2/servicesample50.png",
              "instructionsUrl"  : "http://10.0.1.2/servicesample.md",
              "longDescription"  : "Test V2 Service Broker Plan Long Description",
              "mediumImageUrl"   : "http://10.0.1.2/servicesample32.png",
              "smallImageUrl"    : "http://10.0.1.2/servicesample24.png"
            },
            "name"             : "TestV2ServiceBrokerName",
            "plan_updateable"  : true,
            "tags"             : [ "tag1a", "tag1b" ],
            "plans"            :
            [
                {
                    "description" : "Test V2 Service Broker Plan Description",
                    "free"        : true,
                    "id"          : "plan-guid-here",
                    "metadata"    :
                    {
                      "displayName" : "Test V2 Service Broker Plan Display Name"
                    },
                    "name"        : "TestV2ServiceBrokerPlanName"
                }
            ]
        }
    ]
}
```
## Get Catalog Test

```
curl -X GET -H "Accept:application/json" -H "X-Broker-Api-Version:2.4" -H "X-VCAP-Request-ID:e6dfc74d60e346c399bcfe04b1c2e760::a7a1bb74-5b5f-4356-ba70-eef0e36cf230" -u "TestServiceBrokerUser:TestServiceBrokerPassword" http://localhost:3000/v2/catalog
```

## Provision
### URL
The URL path for the PUT invoked within the service broker implementation is /v2/service_instances/:instance_id
where :instance_id is the id generated by the cloud controller for the service instance.

### Content
The fields passed into a provision PUT within the JSON body are as follows:
  - organization_guid - the GUID of the organization for the cf create-service 
  - plan_id - the id of the plan chosen as part of the cf create-service.  This will be one of the service plans ID's from get catalog
  - service_id - the id of the service offering as part of the cf create-service.  This will be one of the service ID's from get catalog
  - space_guid - the GUID of the space for the cf create-service
  
### Sample JSON

```
{
    "organization_guid" : "a595cc4e-017a-437d-8a6f-7feb2fa0c88b",
    "plan_id"           : "plan-guid-here",
    "service_id"        : "service-guid-here",
    "space_guid"        : "af766c42-2f3f-41cf-8e4b-0c0761ef9d5c",
}
```
  
## Provision Result
### Result
A status code of 201 indicates the service instance has been created.  The expected response body is below.
<br>
A status code of 200 indicates the service instance already exists and the requested parameters are identical to the existing service instance.  The expected response body is below.
<br>
A status code of 409 signifies provision already done for this URL. The expected response body is {}.

The fields returned from a provision PUT within the JSON result are as follows for a 200/201
  - dashboard_url - this is an optional URL for a dashboard for this service instance

### Sample JSON

```
{
    "dashboard_url" : "http://www.ibm.com"
}
```

## Provision Test

```
curl -X PUT -H "Accept:application/json" -H "Content-Type:application/json" -H "X-Broker-Api-Version:2.4" -H "X-VCAP-Request-ID:e81d9e214b9b4a13a843b1da12caa0f4::598af59e-b2b8-4ecd-bdea-b9cf20114509" -u "TestServiceBrokerUser:TestServiceBrokerPassword" -d "{\"organization_guid\":\"e6274fbc-e7d9-448f-a025-b2dbbe654edb\", \"plan_id\":\"9a4194b0-4314-4188-a862-eaa60355beae\", \"service_id\":\"8c1e1e8-76a4-4137-a02e-fed2fc04ba64\", \"space_guid\":\"b0e72e12-205e-4984-8835-991d51ba804a\"}" http://localhost:3000/v2/service_instances/3d06cbfa-e3d3-438c-b894-60f0e8f242ff
```

## Bind
### URL
The URL path for the PUT invoked within the service broker implementation is /v2/service_instances/:instance_id/service_bindings/:binding_id
where :instance_id is the id generated by the cloud controller for the service instance and :binding_id is the id generated by the 
cloud controller for the service/app binding.

### Content
The fields passed into a bind PUT within the JSON body are as follows:
  - app_guid - the guid of the bound application 
  - plan_id - the id of the plan chosen as part of the cf create-service.  This will be one of the service plans ID's from get catalog
  - service_id - the id of the service offering as part of the cf create-service.  This will be one of the service ID's from get catalog
    
### Sample JSON

```
{
    "app_guid"          : "80e0caaa-4145-4f2a-9bf8-1ab00fff1766",
    "plan_id"           : "plan-guid-here",
    "service_id"        : "service-guid-here"
}
```
 
## Bind Result

### Result
A status code of 201 indicates the service binding has been created.  The expected response body is below.
<br>
A status code of 200 indicates the service binding already exists and the requested parameters are identical to the existing service binding.  The expected response body is below.
<br>
A status code of 409 signifies binding already done for this URL. The expected response body is {}.

The fields returned from a bind PUT within the JSON result are as follows for a 200/201:
  - credentials - this is a required hash of credentials
  
### Sample JSON

```
{
    "credentials"   :
    {
        "url"      : "http://10.0.1.2:12345",
        "userid"   : "8401a824-1da7-4114-8664-2460db21661a",
        "password" : "b98e9690-c5e7-405f-9ef6-d6fa36afbaba"
    }
}
```

## Bind Test

```
curl -X PUT -H "Accept:application/json" -H "Content-Type:application/json" -H "X-Broker-Api-Version:2.4" -H "X-VCAP-Request-ID:9449b70048434b3aa7106377cfb463e4::e9710444-5968-4895-9cf4-ae78d69bc168" -u "TestServiceBrokerUser:TestServiceBrokerPassword" -d "{\"app_guid\":\"d3f16a48-8bd1-4aab-a7de-e2a22ad38292\", \"plan_id\":\"9a4194b0-4314-4188-a862-eaa60355beae\", \"service_id\":\"8c14e1e8-76a4-4137-a02e-fed2fc04ba64\"}" http://localhost:3000/v2/service_instances/3d06cbfa-e3d3-438c-b894-60f0e8f242ff/service_bindings/1eef45f2-6151-4394-a958-590a9be09210
```

## Unbind

### URL
The URL path for the DELETE invoked within the service broker implementation is /v2/service_instances/:instance_id/service_bindings/:binding_id
where :instance_id is the id generated by the cloud controller for the service instance and :binding_id is the id generated by the 
cloud controller for the service/app binding.

### Query Parameters
The fields passed into a unbind DELETE as query parameters are as follows:
  - plan_id - the id of the plan chosen as part of the cf create-service.  This will be one of the service plans ID's from get catalog
  - service_id - the id of the service offering as part of the cf create-service.  This will be one of the service ID's from get catalog

## Unbind Result

### Result
A status code of 200 is the expected successful value handled by the cloud controller code.  The expected response body is {}.
<br>
A status code of 410 signifies resource already deleted.  The expected response body is {}.

### Sample JSON

```
{
}
```

## Unbind Test

```
curl -X DELETE -H "Accept:application/json" -H "X-Broker-Api-Version:2.4" -H "X-VCAP-Request-ID:33021f6327374feb9b21fd66e1475aa7::fa04ffe3-0ee4-459c-8715-6c1779318955" -u "TestServiceBrokerUser:TestServiceBrokerPassword" "http://localhost:3000/v2/service_instances/3d06cbfa-e3d3-438c-b894-60f0e8f242ff/service_bindings/1eef45f2-6151-4394-a958-590a9be09210?plan_id=9a4194b0-4314-4188-a862-eaa60355beae&service_id=8c14e1e8-76a4-4137-a02e-fed2fc04ba64"
```

## Unprovision
### URL
The URL path for the DELETE invoked within the service broker implementation is /v2/service_instances/:instance_id
where :instance_id is the id generated by the cloud controller for the service instance. 

### Query Parameters
The fields passed into a unprovision DELETE as query parameters are as follows:
  - plan_id - the id of the plan chosen as part of the cf create-service.  This will be one of the service plans ID's from get catalog
  - service_id - the id of the service offering as part of the cf create-service.  This will be one of the service ID's from get catalog
  
## Unprovision Result

### Result
A status code of 200 is the expected successful value handled by the cloud controller code. The expected response body is {}.
<br>
A status code of 410 signifies resource already deleted. The expected response body is {}.

### Sample JSON

```
{
}
```

## Unprovision Test

```
curl -X DELETE -H "Accept:application/json" -H "X-Broker-Api-Version:2.4" -H "X-VCAP-Request-ID:eb8d14f15efc4832beb65220b2cb48a8::3e3e2108-d7e4-498a-9180-68588153208f" -u "TestServiceBrokerUser:TestServiceBrokerPassword" "http://localhost:3000/v2/service_instances/3d06cbfa-e3d3-438c-b8960f0e8f242ff?plan_id=9a4194b0-4314-4188-a862-eaa60355beae&service_id=8c14e1e8-76a4-4137-a02e-fed2fc04ba64"
```

## Update Service
### URL
The URL path for the PATCH invoked within the service broker implementation is /v2/service_instances/:instance_id
where :instance_id is the id generated by the cloud controller for the service instance.

### Content
The fields passed into a update-service PATCH within the JSON body are as follows:
  - plan_id - the id of the new plan chosen as part of the cf update-service.  This will be one of the service plans ID's from get catalog
  - previous_values:
    - organization_guid - the GUID of the organization specified as part of the cf create-service
    - plan_id - the id of the prior plan chosen as part of the cf create-service.  This will be one of the service plans ID's from get catalog
    - service_id - the id of the service offering as part of the cf create-service.  This will be one of the service ID's from get catalog
    - space_guid - the GUID of the space specified as part of the cf create-service
  
### Sample JSON

```
{
    "plan_id"         : "new-plan-guid-here",
    "previous_values" :
    {
        "organization_guid" : "a595cc4e-017a-437d-8a6f-7feb2fa0c88b",
        "plan_id"           : "plan-guid-here",
        "service_id"        : "service-guid-here",
        "space_guid"        : "af766c42-2f3f-41cf-8e4b-0c0761ef9d5c",
    }
}
```
  
## Update Service Result
### Result
A status code of 200 indicates the service instance has been updated.  The expected response body is {}.

### Sample JSON

```
{
}
```

## Update Service Test

```
curl -X PATCH -H "Accept:application/json" -H "Content-Type:application/json" -H "X-Broker-Api-Version:2.4" -H "X-VCAP-Request-ID:2c0d1b84f741413eab837f28b6a76e3c::fc566b84-baa5-4eea-85ff-884a86730817" -u "TestServiceBrokerUser:TestServiceBrokerPassword" -d "{\"plan_id\":\"30790fa6-9922-4255-b5d8-8da585c2278e\", \"previous_values\":{\"organization_guid\":\"e6274fbc-e7d9-448f-a025-b2dbbe654edb\", \"plan_id\":\"9a4194b0-4314-4188-a862-eaa60355beae\", \"service_id\":\"8c1e1e8-76a4-4137-a02e-fed2fc04ba64\", \"space_guid\":\"b0e72e12-205e-4984-8835-991d51ba804a\"}}" http://localhost:3000/v2/service_instances/3d06cbfa-e3d3-438c-b894-60f0e8f242ff
```

## Enablement Extension Enable

This extension supports enablement/disablement of a service instance.

### URL
The URL path for the PUT for the service broker implementation is /bluemix_v1/service_instances/:instance_id
where :instance_id is the id generated by the cloud controller for the service instance.

### Content
The fields passed into an enable PUT within the JSON body are as follows:
  - enabled - a Boolean signifying whether the service instance should be enabled or not 
    
### Sample JSON

```
{
    "enabled" : true
}
```
 
## Enablement Extension Enable Result

### Result
A status code of 204 is the expected successful value

## Enable Extension Enable Test

```
curl -X PUT -H "Content-Type:application/json" -u "TestServiceBrokerUser:TestServiceBrokerPassword" -d "{\"enabled\":true}" http://localhost:3000/bluemix_v1/service_instances/3d06cbfa-e3d3-438c-b894-60f0e8f242ff
```

## Enablement Extension State

This extension supports retrieving the current state of a service instance.

### URL
The URL path for the GET for the service broker implementation is /bluemix_v1/service_instances/:instance_id
where :instance_id is the id generated by the cloud controller for the service instance.

## Enablement Extension State Result

### Result
A status code of 200 is the expected successful value.

The fields returned from a state GET within the JSON result are as follows:
  - enabled     - whether the service instance is enabled or not
  - active      - whether the service instance is active or not.  Only meaningful if enabled is true
  - last_active - Last accessed/modified in milliseconds since the epoch.  Only meaningful if enabled is true and active is false.
  
### Sample JSON

```
{
    "enabled"    : true,
    "active"     : false,
    "last_active : 1234567890000
}
```

## Enable Extension State Test

```
curl -X GET -H "Accept:application/json" -u "TestServiceBrokerUser:TestServiceBrokerPassword" http://localhost:3000/bluemix_v1/service_instances/3d06cbfa-e3d3-438c-b894-60f0e8f242ff
```
