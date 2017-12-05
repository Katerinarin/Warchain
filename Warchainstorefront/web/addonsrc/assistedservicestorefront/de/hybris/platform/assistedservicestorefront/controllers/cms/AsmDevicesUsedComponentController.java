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
 *
 *
 */
package de.hybris.platform.assistedservicestorefront.controllers.cms;

import de.hybris.platform.addonsupport.controllers.cms.AbstractCMSAddOnComponentController;
import de.hybris.platform.assistedservicestorefront.controllers.AssistedservicestorefrontControllerConstants;
import de.hybris.platform.assistedservicestorefront.customer360.Customer360ProfileFacade;
import de.hybris.platform.assistedservicestorefront.model.AsmDevicesUsedComponentModel;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * CMS controller for AsmDevicesUsedComponent.
 */
@Controller("AsmDevicesUsedComponentController")
@RequestMapping(value = AssistedservicestorefrontControllerConstants.Actions.Cms.AsmDevicesUsedComponent)
public class AsmDevicesUsedComponentController extends AbstractCMSAddOnComponentController<AsmDevicesUsedComponentModel>
{
	private static final Logger LOG = Logger.getLogger(AsmDevicesUsedComponentController.class); //NOSONAR

	@Resource(name = "customer360ProfileFacade")
	private Customer360ProfileFacade customer360ProfileFacade;

	@Override
	protected void fillModel(final HttpServletRequest httpServletRequest, final Model model,
			final AsmDevicesUsedComponentModel asmDevicesUsedComponentModel)
	{
		model.addAttribute("devicesUsedDatas", customer360ProfileFacade.getDevicesUsedData());
	}
}
