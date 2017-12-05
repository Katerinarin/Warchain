/**
 *
 */
package org.training.facades.populators;

import de.hybris.platform.converters.Populator;
import de.hybris.platform.ordersplitting.model.WarehouseModel;
import de.hybris.platform.servicelayer.dto.converter.ConversionException;
import de.hybris.platform.warehousingfacade.storelocator.data.WarehouseData;


/**
 *
 */
public class WRWarehousePopulator implements Populator<WarehouseModel, WarehouseData>
{

	@Override
	public void populate(final WarehouseModel source, final WarehouseData target) throws ConversionException
	{
		target.setLatitude(source.getLat());
		target.setLongtitude(source.getLong());
	}
}
