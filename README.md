## Remove Duplicates From Mock Knack Application Schema

Knack is a no-code platform that includes an online database.
Knack users will at times, through unexpected API usage or an unknown bug,
corrupt their application schemas. One common issue they may run into is
having duplicate fields and/or objects in their application schema. These
duplicates cannot be removed by the Knack UI and lead to TypeErrors and other problems.

The solution provided by this project is an algorithm designed to eliminate
duplicates in a Knack application's JSON file. This algorithm operates by
removing duplicated elements that match specific conditions, and produces a
new file that maintains the same structure and content as the original file
but without duplicated entries.

### Scripts

This project contain the basic script for execution and development specified in
the `package.json` file in the root folder.

#### Run

The program expects to find a file named `mock_application.json` in the **data** folder
and will generate an output file named `clean_application.json`.

The content of the output file will include all the information from the
input file, but duplicated values will be removed.

```
npm start
```

#### Test

The tests for this project are located in the `tests` folder. To run the tests, use the following command:

```
npm test
```

For test coverage, use the following command:

```
npm run test:coverage
```

### Lint

The project follows coding guidelines using `eslint` to reduce errors and ensure code consistency.

To check for eslint errors, use the following command:

```
npm run lint
```

To automatically apply the coding guidelines, use the following command:

```
npm run lint:fix
```

Note: It's recommended to apply the guidelines manually.

### Algorithm

The algorithm is implemented using a deep recursive approach to the input object,
where it traverses every property and checks for duplicate elements when encountering an array.

The rules for detecting duplicates are defined in the configuration and may vary based on the path.

The current location of the object during the recursion is tracked using a string that represents the path,
including the names of properties and the index of the current location.

For example:

```
property.nestedObject.arrayProperty.[1].arrayObjectProperty
```

This path will be used by the rules to specify which rules should apply in each object path.

### Configuration

To sanitize the input schema, a configuration must be passed to the `DuplicationRemover` class constructor.
This configuration provides the necessary rules to identify duplicated objects in the schema,
which helps the algorithm to perform the desired transformation on the input file.

This configuration consist in an array of objects that must have the following structure:

| Property name   | Type                      | Description                                                          |
|-----------------|---------------------------|----------------------------------------------------------------------|
| objectPathRegex | `Regex`                   | Defines the path where a certain rule / identity should be activated |
| identity        | `ObjectIdentity` / `null` | Defines how the algorithm identifies a object to match duplication   |                                                                            |

When an entry in the array has a null value for the property **identity**,
the content will remain unchanged and no modifications will be made to the
output array for that specific path.

#### Object Identity

Class that generates the identity string to define if to object are a duplicate.

Current implementations of the `ObjectIdentity` class:

| Class                  | Description                                                                           | Arguments                                     |
|------------------------|---------------------------------------------------------------------------------------|-----------------------------------------------|
| `ObjectIdentity`       | Generates an identity for an object using all the primitives properties of the object | None                                          |
| `CustomObjectIdentity` | Generates an identity for an object specific properties of the object                 | Array with the names of the properties to use |

#### ConfigurationBuilder

The `ConfigurationBuilder` class can be utilized to assist with creating the
proper structure for the configuration parameter, ensuring its structure.

This class provides assistance with the generation of the configuration, giving
helper methods to chain multiple configuration rules.

Also, adds a generic rule for all the paths that may not have a defined configuration.
With the current implementation, the generic rule will perform no modifications.

#### Example

```
const configuration = new ConfigurationBuilder()
  .addCustomObjectIdentity(/regex_path/, ["property"])
  .addObjectIdentity(/regex_path2/)
  .build();

const duplicationRemover = new DuplicationRemover(configuration);

const output = duplicationRemover.sanitize(input)

```

#### Input

```
{
    "regex_path": [
        {
            "property": "value",
            "property2": 1,
            "property3": false
        },
        {
            "property2": 1,
            "property: "value"
        }
    ],
    "regex_path2": [ 1, 2, 3, 3 ]
}
```

#### Output

```
[
    "regex_path": [
        {
            "property": "value",
            "property2": 1,
            "property3": false
        }
    ],
    "regex_path2": [ 1, 2, 3 ],

```


### Improvements

* Add more error handling in the read / write of the files.
* Create custom errors for each specific validation
* Add a verbose option to log details and help with the troubleshooting
* Add typescript to minimize the type errors and help with the development,
  also providing interfaces for the configuration objects.
* Limit the execution recursion to avoid issues with circular objects.
* Add additional identity rules to handle other use-cases.
* Add options to define default behaviours, like the default identity applied.
