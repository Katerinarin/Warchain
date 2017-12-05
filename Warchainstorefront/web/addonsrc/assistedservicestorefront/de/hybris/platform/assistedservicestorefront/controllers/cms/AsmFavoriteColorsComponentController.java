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
import de.hybris.platform.assistedservicestorefront.model.AsmFavoriteColorsComponentModel;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * CMS controller for AsmFavoriteColorsComponent.
 */
@Controller("AsmFavoriteColorsComponentController")
@RequestMapping(value = AssistedservicestorefrontControllerConstants.Actions.Cms.AsmFavoriteColorsComponent)
public class AsmFavoriteColorsComponentController extends AbstractCMSAddOnComponentController<AsmFavoriteColorsComponentModel>
{
	private static final Logger LOG = Logger.getLogger(AsmFavoriteColorsComponentController.class); //NOSONAR

	@Resource(name = "customer360ProfileFacade")
	private Customer360ProfileFacade customer360ProfileFacade;

	@Override
	protected void fillModel(final HttpServletRequest httpServletRequest, final Model model,
			final AsmFavoriteColorsComponentModel asmFavoriteColorsComponentModel)
	{
		model.addAttribute("favoriteColorsDatas", customer360ProfileFacade.getFavoriteColorsData());
	}
}
