import json

from django.http import HttpResponse, JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect, csrf_exempt
from django.views.generic import View

from pyepbd import FACTORESDEPASOOFICIALES, weighted_energy, readenergydata, ep2dict

#@method_decorator(csrf_protect, name='dispatch')
#@method_decorator(ensure_csrf_cookie, name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
class EPIndicatorsView(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse('API service')

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            data = json.loads(request.body.decode('utf-8'))
            krdel = float(data.get('krdel', 1.0))
            kexp = float(data.get('kexp', 1.0))
            area = float(data.get('area', 1.0))
            components = data.get('components', [])

            # f.write("krdel: %s\n"
            #         "kexp: %s\n"
            #         "area: %s\n"
            #         "components: %s\n %s %s %s\n" %
            #         (krdel, kexp, area, components,
            #          type(krdel), type(kexp), type(components)))

            data = readenergydata(components)

            # f.write("Energy data: %s" % data)

            epresults = weighted_energy(data, krdel, FACTORESDEPASOOFICIALES, kexp)
            result = ep2dict(epresults, area)
            return JsonResponse(result)
