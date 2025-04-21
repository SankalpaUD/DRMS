import { Resource } from '../models/resource.model.js';

export const handleWebhook = async (req, res) => {
    const intentName = req.body.queryResult.intent.displayName;

    if (intentName === 'FindSuitablePlace') {
        const parameters = req.body.queryResult.parameters;
        const participants = parameters.participants;

        try {
            if (!participants) {
                return res.json({
                    fulfillmentText: 'How many participants will be attending?',
                });
            }

            const suitableResources = await Resource.find({
                resourceType: 'PremisesResourceType', 
                premiType: { $ne: 'Computer Lab' }, 
                capacity: { $gte: participants }, 
                availability: true, 
            }).sort({ capacity: 1 }); 
            if (suitableResources.length > 0) {
                // Find the closest capacity to the number of participants
                const closestResource = suitableResources[0];
                return res.json({
                    fulfillmentText: `The most suitable place is ${closestResource.name} with a capacity of ${closestResource.capacity}.`,
                });
            } else {
                return res.json({
                    fulfillmentText: 'No suitable place is available for the specified number of participants.',
                });
            }
        } catch (error) {
            console.error('Error finding suitable place:', error);
            return res.json({
                fulfillmentText: 'There was an error finding a suitable place. Please try again later.',
            });
        }
    } else if (intentName === 'GetResources') {
        const parameters = req.body.queryResult.parameters;
        const { searchTerm, type, availability, resourceType, additionalAttributes } = parameters;

        try {
            let query = {};

            // Apply filters based on parameters
            if (searchTerm) {
                query.name = { $regex: searchTerm, $options: 'i' }; 
            }
            if (type) {
                query.type = type;
            }
            if (availability) {
                query.availability = availability === 'true';
            }
            if (resourceType) {
                query.resourceType = resourceType;
            }
            if (additionalAttributes) {
                try {
                    const attributes = JSON.parse(additionalAttributes);
                    Object.keys(attributes).forEach((key) => {
                        query[`additionalAttributes.${key}`] = attributes[key];
                    });
                } catch (error) {
                    return res.json({
                        fulfillmentText: 'Invalid additionalAttributes format. Please try again.',
                    });
                }
            }

            // Query MongoDB with the constructed query
            const resources = await Resource.find(query);

            if (resources.length > 0) {
                const resourceNames = resources.map(resource => resource.name).join(', ');
                res.json({
                    fulfillmentText: `The resources available are: ${resourceNames}.`,
                });
            } else {
                res.json({
                    fulfillmentText: `No resources match your criteria.`,
                });
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
            res.json({
                fulfillmentText: 'There was an error fetching the resources. Please try again later.',
            });
        }
    } else {
        res.json({
            fulfillmentText: 'I am not sure how to handle that request.',
        });
    }
};