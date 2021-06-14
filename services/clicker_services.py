from django.contrib.auth.models import User
from backend.models import MainCycle, Boost
from backend.serializers import BoostSerializer
from django.db.models import Prefetch


def main_page(request):
    user = User.objects.get(id=request.user.id)
    if user:
        main_cycle = MainCycle.objects.get(user=request.user)
        return (False, 'index.html', {'user':user, 'main_cycle':main_cycle})
    else:
        return (True, 'login', {})


def set_main_cycle(request):
    main_cycle = MainCycle.objects.get(user=request.user)
    is_level_up = main_cycle.set_main_cycle(int(request.data['coins_count']))
    main_cycle.save()
    if is_level_up:
        boosts_query = Boost.objects.filter(main_cycle=main_cycle)
        boosts = BoostSerializer(boosts_query, many=True).data
        return (main_cycle.coins_count, boosts)
    return (main_cycle.coins_count, None)


def upgrade_boost(request):
    current_level = request.data['boost_level']
    main_cycle = MainCycle.objects.prefetch_related(
    Prefetch('boosts',
              queryset=Boost.objects.filter(level=current_level),
              to_attr='current_boost'
              )).get(user=request.user)
    boost = main_cycle.current_boost[0]
    
    level, price, power = boost.upgrade()
    boost.save()
    return (main_cycle, level, price, power)
