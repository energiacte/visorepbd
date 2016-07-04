from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^epindicators', views.EPIndicatorsView.as_view(), name=u'epindicators'),
    url(r'^wfactors', views.WFactorsView.as_view(), name=u'wfactors'),
]
