/**
 *
 */
package org.training.facades.storefinder.populators;

import de.hybris.platform.commercefacades.storelocator.converters.populator.PointOfServicePopulator;
import de.hybris.platform.commercefacades.storelocator.data.PointOfServiceData;
import de.hybris.platform.storelocator.model.PointOfServiceModel;

import org.apache.commons.collections.CollectionUtils;


/**
 *
 */
public class DWWarehousingPointOfServicePopulator extends PointOfServicePopulator
{

	@Override
	public void populate(final PointOfServiceModel source, final PointOfServiceData target)
	{
		super.populate(source, target);
		if (CollectionUtils.isNotEmpty(source.getWarehouses()))
		{
			target.setWarehouseLat(source.getWarehouses().get(0).getLat());
			target.setWarehouseLong(source.getWarehouses().get(0).getLong());
		}

	}
}
