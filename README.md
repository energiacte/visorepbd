visorepbd
=========

Implementation of the ISO EN 52000-1 standard and panel to explore NZEB indicators

Introduction
------------

This software implements the *ISO EN 52000-1: Energy performance of buildings - Overarching EPB assessment - General framework and procedures* standard.

The following assumptions are taken:

- all weighting factors are constant through timesteps
- threre's no priority is set for energy production (average step A weighting factor f_we_el_stepA)
- all on-site produced energy from non cogeneration sources is considered as delivered
- the load matching factor is set to 1.0

TODO
----

- allow other values of load matching factor (or functions) (formula 32, B.32)
- get results by use items (service), maybe using the reverse method E.3 (E.3.6, E.3.7)

Usage
-----

**To run the panel** type ```make``` on the command line.
**To run the tests** type ```make test``` on the command line.
