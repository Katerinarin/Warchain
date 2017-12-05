/*
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2016 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */
package de.hybris.platform.orderselfserviceaddon.forms;


import java.util.Map;


public class OrderEntryCancelForm
{

	private Map<Integer, Integer> cancelEntryQuantity;

	public Map<Integer, Integer> getCancelEntryQuantity()
	{
		return cancelEntryQuantity;
	}

	public void setCancelEntryQuantity(Map<Integer, Integer> cancelEntryQuantity)
	{
		this.cancelEntryQuantity = cancelEntryQuantity;
	}
}
