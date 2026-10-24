"""Config flow for State Class Manager."""

from __future__ import annotations

import voluptuous as vol

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback

from .const import CONF_SHOW_IN_SIDEBAR, DOMAIN


class StateClassManagerConfigFlow(ConfigFlow, domain=DOMAIN):
    """Confirm, run the automatic setup, show the result."""

    VERSION = 1

    def __init__(self) -> None:
        self._message = ""

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return StateClassManagerOptionsFlow()

    async def async_step_user(self, user_input=None) -> ConfigFlowResult:
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        if user_input is not None:
            from . import async_run_setup  # local import avoids a cycle

            _result, self._message = await async_run_setup(self.hass)
            return await self.async_step_done()
        return self.async_show_form(step_id="user")

    async def async_step_done(self, user_input=None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(title="State Class Manager", data={})
        return self.async_show_form(
            step_id="done", description_placeholders={"result": self._message}
        )


class StateClassManagerOptionsFlow(OptionsFlow):
    """Options: show the panel in the sidebar or not."""

    async def async_step_init(self, user_input=None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(data=user_input)
        current = self.config_entry.options.get(CONF_SHOW_IN_SIDEBAR, True)
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {vol.Required(CONF_SHOW_IN_SIDEBAR, default=current): bool}
            ),
        )
